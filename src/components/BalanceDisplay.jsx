import { useEffect, useState } from "react";
import { ethers } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)"
];

export default function BalanceDisplay({ token, address, provider }) {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || !token || !address) return;

      try {
        if (token.symbol === "STT") {
          const native = await provider.getBalance(address);
          setBalance(ethers.formatEther(native));
        } else {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const bal = await contract.balanceOf(address);
          setBalance(ethers.formatEther(bal));
        }
      } catch (err) {
        console.warn("Gagal ambil saldo:", err);
        setBalance("0");
      }
    };

    fetchBalance();
  }, [token, address, provider]);

  return (
    <div className="text-sm text-gray-600">
      Saldo: {Number(balance).toFixed(4)} {token.symbol}
    </div>
  );
}
