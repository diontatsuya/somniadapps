import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { universalTokenSwapAbi } from "../abi/universalTokenSwapAbi";
import { SWAP_CONTRACT, TOKENS } from "../constants/addresses";
import TokenSelector from "./TokenSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
];

export default function SwapForm({ provider }) {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (provider) {
        const _signer = await provider.getSigner();
        const _addr = await _signer.getAddress();
        setSigner(_signer);
        setUserAddress(_addr);
      }
    };
    init();
  }, [provider]);

  const handleSwap = async () => {
    try {
      setError("");
      setTxHash(null);
      setLoading(true);

      const contract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);
      const amountInWei = ethers.parseEther(amount);

      // Jika bukan STT (native), cek allowance & approve jika perlu
      if (fromToken.symbol !== "STT") {
        const tokenContract = new ethers.Contract(fromToken.address, erc20Abi, signer);
        const allowance = await tokenContract.allowance(userAddress, SWAP_CONTRACT);

        if (allowance < amountInWei) {
          const approveTx = await tokenContract.approve(SWAP_CONTRACT, amountInWei);
          await approveTx.wait();
        }
      }

      // Lakukan swap
      const tx = await contract.swap(
        fromToken.address,
        toToken.address,
        amountInWei,
        fromToken.symbol === "STT" ? { value: amountInWei } : {}
      );

      await tx.wait();
      setTxHash(tx.hash);
    } catch (err) {
      console.error(err);
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
    } catch {
      setError("❌ Estimasi gagal. Pastikan jaringan dan input valid.");
    }
  };

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setEstimate(null);
    setTxHash(null);
  };

  return (
    <Card className="max-w-md mx-auto mt-6 p-4 border rounded-2xl shadow-md">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-center">🌀 Token Swap</h2>

        <TokenSelector label="Dari" token={fromToken} onChange={setFromToken} />
        <TokenSelector label="Ke" token={toToken} onChange={setToToken} />

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
