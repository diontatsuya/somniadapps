import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SwapForm from "./components/SwapForm";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        await ethProvider.send("eth_requestAccounts", []); // Minta akses wallet

        const signer = await ethProvider.getSigner();
        const addr = await signer.getAddress();
        setProvider(ethProvider);
        setAddress(addr);

        // Tampilkan popup sign
        const message = `Login to SomniaTokenSwap as ${addr}`;
        const sig = await signer.signMessage(message);
        setSignature(sig);
      } catch (err) {
        console.error("Gagal connect atau sign:", err);
        alert("Gagal menghubungkan wallet atau signature ditolak.");
      }
    } else {
      alert("MetaMask tidak ditemukan. Silakan instal dulu.");
    }
  };

  const disconnect = () => {
    setProvider(null);
    setAddress("");
    setSignature("");
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
            <div className="text-sm">
              👛 {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={disconnect}
            >
              Logout
            </button>
          </div>

          {/* Signature info */}
          <div className="text-xs text-green-400 mb-2 break-words">
            ✅ Signed: {signature.slice(0, 10)}...{signature.slice(-10)}
          </div>

          <SwapForm provider={provider} />
        </>
      )}
    </div>
  );
}
