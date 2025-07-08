import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { SWAP_CONTRACT, TOKENS } from "../constants/addresses";
import { universalTokenSwapAbi } from "../abi/universalTokenSwapAbi";
import { Button } from "@/components/ui/button";
import TokenSelector from "./TokenSelector";
import SwapButton from "./SwapButton";

export default function SwapForm({ wallet, provider }) {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("0");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState(null);

  const signer = provider ? await provider.getSigner() : null;
  const swapContract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);

  useEffect(() => {
    if (amount && ethers.isAddress(fromToken.address) && ethers.isAddress(toToken.address)) {
      estimate();
    }
  }, [amount, fromToken, toToken]);

  async function estimate() {
    try {
      const amt = ethers.parseUnits(amount || "0", 18);
      const result = await swapContract.estimateSwap(fromToken.address, toToken.address, amt);
      setEstimatedAmount(ethers.formatUnits(result, 18));
    } catch (err) {
      console.error("Estimate failed", err);
      setEstimatedAmount("0");
    }
  }

  async function checkAndApprove() {
    const tokenContract = new ethers.Contract(fromToken.address, [
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)"
    ], signer);

    const allowance = await tokenContract.allowance(wallet, SWAP_CONTRACT);
    const amt = ethers.parseUnits(amount, 18);

    if (allowance < amt) {
      const tx = await tokenContract.approve(SWAP_CONTRACT, ethers.MaxUint256);
      await tx.wait();
    }
  }

  async function handleSwap() {
    try {
      setStatus("Approving...");
      await checkAndApprove();

      setStatus("Swapping...");
      const amt = ethers.parseUnits(amount, 18);
      const tx = await swapContract.swap(fromToken.address, toToken.address, amt);
      setTxHash(tx.hash);
      await tx.wait();
      setStatus("✅ Swap successful");
    } catch (err) {
      setStatus(`❌ Swap failed: ${err.message}`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TokenSelector selected={fromToken} onChange={setFromToken} />
        <span>→</span>
        <TokenSelector selected={toToken} onChange={setToToken} />
      </div>

      <input
        type="number"
        placeholder={`Amount in ${fromToken.name}`}
        className="w-full border rounded px-2 py-1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="text-sm text-gray-500">
        Estimated: {estimatedAmount} {toToken.name}
      </div>

      <SwapButton onClick={handleSwap} disabled={!amount || !wallet}>
        Swap
      </SwapButton>

      {status && (
        <div className="text-sm text-center mt-2 text-blue-600">
          {status}
          {txHash && (
            <div>
              <a
                href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline text-sm"
              >
                View on Explorer
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
