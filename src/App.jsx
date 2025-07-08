import { useState, useEffect } from "react";
import { ethers } from "ethers";
import SwapForm from "./components/SwapForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const signer = await prov.getSigner();
      const address = await signer.getAddress();
      setProvider(prov);
      setWallet(address);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setProvider(null);
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">🔁 Somnia Token Swap</h1>

          {!wallet ? (
            <Button onClick={connectWallet} className="w-full">
              Connect MetaMask
            </Button>
          ) : (
            <>
              <div className="text-sm text-gray-600 break-all">
                Wallet: {wallet}
              </div>
              <Button variant="destructive" onClick={disconnectWallet} className="w-full">
                Log Out
              </Button>

              {/* Swap UI */}
              <SwapForm wallet={wallet} provider={provider} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
