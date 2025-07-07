import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tokenAIcon = "/gold.png";
const tokenBIcon = "/gem.png";

const TOKEN_A = {
  name: "GOLD",
  address: "0x7e86277abbedac497e23d7abf43913833fb7ba2e",
  icon: tokenAIcon,
};

const TOKEN_B = {
  name: "GEM",
  address: "0x73f75ac5400f48bad2bff033eae4248cfef9b499",
  icon: tokenBIcon,
};

const SWAP_CONTRACT = "0x63a04beb918655679123c2dc1f43d142da5c7fea";

const TOKEN_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) public returns (bool)"
];

const SWAP_ABI = [
  "function swap(address tokenA, address tokenB, uint256 amount) public"
];

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [amount, setAmount] = useState("");
  const [goldBalance, setGoldBalance] = useState("0");
  const [gemBalance, setGemBalance] = useState("0");

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

  const handleSwap = async () => {
    if (!provider || !wallet) return;
    const signer = await provider.getSigner();
    const tokenA = new ethers.Contract(TOKEN_A.address, TOKEN_ABI, signer);
    const swapContract = new ethers.Contract(SWAP_CONTRACT, SWAP_ABI, signer);

    const amountInWei = ethers.parseUnits(amount, 18);
    const allowance = await tokenA.allowance(wallet, SWAP_CONTRACT);

    if (allowance < amountInWei) {
      const txApprove = await tokenA.approve(SWAP_CONTRACT, amountInWei);
      await txApprove.wait();
    }

    const tx = await swapContract.swap(TOKEN_A.address, TOKEN_B.address, amountInWei);
    await tx.wait();
    alert("✅ Swap berhasil!");
  };

  useEffect(() => {
    if (wallet && provider) {
      const loadBalances = async () => {
        const tokenA = new ethers.Contract(TOKEN_A.address, TOKEN_ABI, provider);
        const tokenB = new ethers.Contract(TOKEN_B.address, TOKEN_ABI, provider);

        const balanceA = await tokenA.balanceOf(wallet);
        const balanceB = await tokenB.balanceOf(wallet);

        setGoldBalance(ethers.formatUnits(balanceA, 18));
        setGemBalance(ethers.formatUnits(balanceB, 18));
      };

      loadBalances();
    }
  }, [wallet, provider]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-bold text-center">🌐 Somnia Swap</h1>

          {wallet && (
            <div className="text-xs text-gray-500 text-center">
              GOLD: {parseFloat(goldBalance).toFixed(4)} | GEM: {parseFloat(gemBalance).toFixed(4)}
            </div>
          )}

          {!wallet ? (
            <Button onClick={connectWallet} className="w-full">
              Connect MetaMask
            </Button>
          ) : (
            <>
              <div className="text-sm text-gray-600 truncate">Wallet: {wallet}</div>
              <Button variant="destructive" onClick={disconnect} className="w-full">
                Log Out
              </Button>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img src={TOKEN_A.icon} alt="GOLD" className="w-6 h-6" />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="Amount in GOLD"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="text-center">🔄</div>
                <div className="flex items-center gap-2">
                  <img src={TOKEN_B.icon} alt="GEM" className="w-6 h-6" />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    placeholder="Estimated GEM"
                    value={amount}
                    disabled
                  />
                </div>
              </div>

              <Button className="w-full mt-4" onClick={handleSwap} disabled={!amount}>
                Swap
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
