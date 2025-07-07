import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import goldIcon from "/gold.png";
import gemIcon from "/gem.png";

const TOKEN_A = {
  name: "GOLD",
  address: "0x7e86277abbedac497e23d7abf43913833fb7ba2e",
  icon: goldIcon,
};

const TOKEN_B = {
  name: "GEM",
  address: "0x73f75ac5400f48bad2bff033eae4248cfef9b499",
  icon: gemIcon,
};

const SWAP_CONTRACT = "0x63a04beb918655679123c2dc1f43d142da5c7fea";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const signer = await prov.getSigner();
      const addr = await signer.getAddress();
      setProvider(prov);
      setWallet(addr);
    }
  };

  const disconnect = () => {
    setWallet(null);
    setProvider(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">💱 Somnia Token Swap</h1>

          {!wallet ? (
            <Button onClick={connectWallet} className="w-full">
              Connect MetaMask
            </Button>
          ) : (
            <>
              <div className="text-xs text-gray-600 truncate mb-1">Wallet: {wallet}</div>
              <Button variant="destructive" onClick={disconnect} className="w-full">
                Log Out
              </Button>

              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <img src={TOKEN_A.icon} alt="GOLD" className="w-6 h-6 rounded-full" />
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Amount in GOLD"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="text-center text-xl">🔄</div>

                <div className="flex items-center gap-2">
                  <img src={TOKEN_B.icon} alt="GEM" className="w-6 h-6 rounded-full" />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100"
                    placeholder="Estimated GEM"
                    value={amount}
                    disabled
                  />
                </div>
              </div>

              <Button className="w-full mt-4">Swap</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
