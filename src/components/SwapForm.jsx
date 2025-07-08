import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SWAP_CONTRACT, TOKEN_LIST } from "@/constants/addresses";
import { universalTokenSwapAbi } from "@/abi/universalTokenSwapAbi";

export default function SwapForm({ provider, wallet }) {
  const [fromToken, setFromToken] = useState(TOKEN_LIST[0]);
  const [toToken, setToToken] = useState(TOKEN_LIST[1]);
  const [amount, setAmount] = useState("");
  const [estimated, setEstimated] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const estimateSwap = async () => {
    if (!provider || !wallet || !amount || fromToken.address === toToken.address) return;
    setError("");
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);
      const est = await contract.estimateSwap(fromToken.address, toToken.address, ethers.parseUnits(amount, 18));
      setEstimated(ethers.formatUnits(est, 18));
    } catch (err) {
      setError("Estimasi gagal. Pastikan kontrak swap memiliki fungsi estimateSwap dan token cukup tersedia.");
    }
  };

  const handleSwap = async () => {
    if (!provider || !wallet || !amount || fromToken.address === toToken.address) return;
    setLoading(true);
    setError("");
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);
      const tx = await contract.swap(
        fromToken.address,
        toToken.address,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      setAmount("");
      setEstimated("0");
    } catch (err) {
      setError("Swap gagal. Pastikan allowance dan saldo mencukupi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    estimateSwap();
  }, [amount, fromToken, toToken]);

  return (
    <Card className="w-full shadow-xl">
      <CardContent className="p-4 space-y-4">
        <div className="text-center text-lg font-semibold">💱 Token Swap</div>

        <div className="space-y-2">
          <label className="text-sm font-medium">From Token</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={fromToken.address}
            onChange={(e) => setFromToken(TOKEN_LIST.find(t => t.address === e.target.value))}
          >
            {TOKEN_LIST.map((token) => (
              <option key={token.address} value={token.address}>{token.name}</option>
            ))}
          </select>

          <label className="text-sm font-medium">To Token</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={toToken.address}
            onChange={(e) => setToToken(TOKEN_LIST.find(t => t.address === e.target.value))}
          >
            {TOKEN_LIST.map((token) => (
              <option key={token.address} value={token.address}>{token.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="w-full border rounded px-2 py-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="text-sm">Estimated: {estimated} {toToken.name}</div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button onClick={handleSwap} disabled={loading || !amount || fromToken.address === toToken.address} className="w-full">
            {loading ? "Swapping..." : "Swap"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
          }
