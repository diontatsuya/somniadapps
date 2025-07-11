import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { universalTokenSwapAbi } from "../abi/universalTokenSwapAbi";
import { SWAP_CONTRACT, TOKENS } from "../constants/addresses";
import TokenSelector from "./TokenSelector";
import BalanceDisplay from "./BalanceDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SwapForm({ provider, address }) {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSigner = async () => {
      if (provider) {
        const _signer = await provider.getSigner();
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
      setError(err.reason || err.message || "Swap failed.");
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
      setError("❌ Estimasi gagal. Pastikan jaringan terhubung dan input valid.");
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
    <Card className="max-w-md mx-auto mt-6 p-4 border rounded-2xl shadow-md">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-center">🌀 Token Swap</h2>

        <TokenSelector label="Dari" token={fromToken} onChange={setFromToken} />
        <BalanceDisplay token={fromToken} address={address} provider={provider} />

        <TokenSelector label="Ke" token={toToken} onChange={setToToken} />
        <BalanceDisplay token={toToken} address={address} provider={provider} />

        <input
          className="border p-2 rounded"
          placeholder="Jumlah"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex justify-between items-center">
          <Button onClick={handleEstimate} disabled={!signer || !amount || loading}>
            Estimasi
          </Button>
          <Button onClick={handleSwitch} variant="outline">
            🔁 Tukar
          </Button>
          <Button onClick={handleSwap} disabled={!signer || !amount || loading}>
            {loading ? "⏳ Swapping..." : "Swap"}
          </Button>
        </div>

        {estimate && (
          <div className="text-sm text-green-600">
            💱 Estimasi hasil: {estimate} {toToken.symbol}
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

        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </Card>
  );
}
