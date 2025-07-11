import { useEffect, useState } from "react";
import { Contract, parseEther, formatEther } from "ethers";
import { universalTokenSwapAbi } from "../abi/universalTokenSwapAbi";
import { erc20Abi } from "../abi/erc20Abi";
import { SWAP_CONTRACT, TOKENS } from "../constants/addresses";
import TokenSelector from "./TokenSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SwapForm({ provider }) {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [estimate, setEstimate] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const getSigner = async () => {
      if (provider) {
        const _signer = await provider.getSigner();
        setSigner(_signer);
      }
    };
    getSigner();
  }, [provider]);

  // Ambil saldo saat token fromToken berubah
  useEffect(() => {
    const fetchBalance = async () => {
      if (signer && fromToken?.address) {
        try {
          const userAddress = await signer.getAddress();
          const erc20 = new Contract(fromToken.address, erc20Abi, signer);
          const bal = await erc20.balanceOf(userAddress);
          setBalance(formatEther(bal));
        } catch (err) {
          console.error("Gagal ambil saldo:", err);
          setBalance("0");
        }
      }
    };
    fetchBalance();
  }, [signer, fromToken]);

  const handleSwap = async () => {
    try {
      setError("");
      setTxHash(null);

      if (fromToken.address === toToken.address) {
        setError("❌ Tidak bisa swap token yang sama.");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        setError("❌ Masukkan jumlah token yang valid.");
        return;
      }

      const amountInWei = parseEther(amount);
      const userAddress = await signer.getAddress();
      const userBalance = parseEther(balance);

      if (amountInWei > userBalance) {
        setError("❌ Jumlah melebihi saldo.");
        return;
      }

      setLoading(true);
      const contract = new Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);

      const isNative = fromToken.symbol === "STT"; // pengecualian STT

      if (!isNative) {
        const erc20 = new Contract(fromToken.address, erc20Abi, signer);
        const allowance = await erc20.allowance(userAddress, SWAP_CONTRACT);
        if (allowance < amountInWei) {
          setApproving(true);
          const approveTx = await erc20.approve(SWAP_CONTRACT, amountInWei);
          await approveTx.wait();
          setApproving(false);
        }
      }

      const tx = await contract.swap(fromToken.address, toToken.address, amountInWei);
      await tx.wait();
      setTxHash(tx.hash);
      setAmount("");
      setEstimate(null);
    } catch (err) {
      console.error("Swap failed:", err);
      setError(err.reason || err.message || "Swap gagal.");
    } finally {
      setLoading(false);
      setApproving(false);
    }
  };

  const handleEstimate = async () => {
    try {
      setError("");
      setEstimate(null);

      if (fromToken.address === toToken.address) {
        setError("❌ Tidak bisa estimasi token yang sama.");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        setError("❌ Masukkan jumlah token yang valid.");
        return;
      }

      const contract = new Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);
      const amountInWei = parseEther(amount);
      const estimated = await contract.estimateSwap(fromToken.address, toToken.address, amountInWei);
      setEstimate(formatEther(estimated));
    } catch (err) {
      console.error("Estimate failed:", err);
      setError("❌ Estimasi gagal. Pastikan jaringan dan input valid.");
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
        <TokenSelector label="Ke" token={toToken} onChange={setToToken} />

        <div className="text-xs text-gray-600">
          Saldo: {balance} {fromToken.symbol}
        </div>

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
          <Button
            onClick={handleSwap}
            disabled={!signer || !amount || loading || approving}
          >
            {approving
              ? "🔒 Approving..."
              : loading
              ? "⏳ Swapping..."
              : "Swap"}
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
