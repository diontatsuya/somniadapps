import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SwapForm from "./components/SwapForm";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethProvider.getSigner();
      const addr = await signer.getAddress();
      setProvider(ethProvider);
      setAddress(addr);
    } else {
      alert("MetaMask tidak ditemukan. Silakan instal dulu.");
    }
  };

  const disconnect = () => {
    setProvider(null);
    setAddress("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {!provider ? (
        <div className="text-center mt-8">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm break-all">👛 {address}</div>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={disconnect}
            >
              Logout
            </button>
          </div>
          <SwapForm provider={provider} />
        </>
      )}
    </div>
  );
}
