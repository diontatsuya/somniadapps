import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { universalTokenSwapAbi } from "../abi/universalTokenSwapAbi";
import { SWAP_CONTRACT, TOKEN_A, TOKEN_B } from "../constants/addresses";
import TokenSelector from "./TokenSelector";

export default function SwapForm({ provider }) {
  const [fromToken, setFromToken] = useState(TOKEN_A);
  const [toToken, setToToken] = useState(TOKEN_B);
  const [amount, setAmount] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSigner = async () => {
      if (provider) {
        const _signer = await new ethers.BrowserProvider(provider).getSigner();
        setSigner(_signer);
      }
    };
    getSigner();
  }, [provider]);

  const handleSwap = async () => {
    try {
      setError("");
      setTxHash(null);
      setLoading(true);

      const contract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);
      const amountInWei = ethers.parseEther(amount);
      const tx = await contract.swap(fromToken.address, toToken.address, amountInWei);
      await tx.wait();
      setTxHash(tx.hash);
    } catch (err) {
      setError(err?.reason || err?.message || "Swap failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEstimate = async () => {
    try {
      setError("");
      setEstimate(null);

      const contract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);
      const amountInWei = ethers.parseEther(amount);
      const estimated = await contract.estimateSwap(fromToken.address, toToken.address, amountInWei);
      setEstimate(ethers.formatEther(estimated));
    } catch (err) {
      setError("Estimasi gagal. Pastikan jaringan terhubung dan input valid.");
    }
  };

  const handleSwitch = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setEstimate(null);
    setTxHash(null);
  };

  return (
    <div className="bg-white border p-4 rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">🌀 Token Swap</h2>

      <TokenSelector label="Dari" token={fromToken} onChange={setFromToken} />
      <TokenSelector label="Ke" token={toToken} onChange={setToToken} />

      <input
        className="border p-2 w-full rounded"
        placeholder="Jumlah"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="flex justify-between items-center gap-2">
        <button
          onClick={handleEstimate}
          disabled={!signer || !amount || loading}
          className="px-3 py-1 rounded bg-yellow-500 text-white"
        >
          Estimasi
        </button>
        <button
          onClick={handleSwitch}
          className="px-3 py-1 rounded border"
        >
          🔁 Tukar
        </button>
        <button
          onClick={handleSwap}
          disabled={!signer || !amount || loading}
          className="px-3 py-1 rounded bg-green-600 text-white"
        >
          {loading ? "⏳ Swapping..." : "Swap"}
        </button>
      </div>

      {estimate && (
        <div className="text-sm text-green-600">
          💱 Estimasi hasil: {estimate} {toToken.name}
        </div>
      )}

      {txHash && (
        <div className="text-sm text-blue-600 break-words">
          ✅ Transaksi sukses:{" "}
          <a
            href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {txHash}
          </a>
        </div>
      )}

      {error && <div className="text-sm text-red-600">❌ {error}</div>}
    </div>
  );
}
