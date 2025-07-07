import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tokenAIcon = "/gold.png";
const tokenBIcon = "/gem.png";

const GOLD = {
  name: "GOLD",
  address: "0x7e86277abbedac497e23d7abf43913833fb7ba2e",
  icon: tokenAIcon,
};

const GEM = {
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
  const [tokenFrom, setTokenFrom] = useState(GOLD);
  const [tokenTo, setTokenTo] = useState(GEM);
  const [balanceFrom, setBalanceFrom] = useState("0");
  const [balanceTo, setBalanceTo] = useState("0");
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setTxHash(null);
  };

  const handleSwap = async () => {
    if (!provider || !wallet) return;
    setLoading(true);
    setTxHash(null);
    try {
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenFrom.address, TOKEN_ABI, signer);
      const swapContract = new ethers.Contract(SWAP_CONTRACT, SWAP_ABI, signer);
      const amountInWei = ethers.parseUnits(amount, 18);

      const allowance = await token.allowance(wallet, SWAP_CONTRACT);
      if (allowance < amountInWei) {
        const txApprove = await token.approve(SWAP_CONTRACT, amountInWei);
        await txApprove.wait();
      }

      const tx = await swapContract.swap(tokenFrom.address, tokenTo.address, amountInWei);
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      alert("✅ Swap berhasil!");
    } catch (e) {
      alert("❌ Gagal melakukan swap: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    const from = tokenFrom;
    setTokenFrom(tokenTo);
    setTokenTo(from);
    setAmount("");
    setTxHash(null);
  };

  const addTokenToWallet = async (token) => {
    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.name,
            decimals: 18,
            image: window.location.origin + token.icon,
          },
        },
      });
      if (wasAdded) {
        alert(`✅ ${token.name} berhasil ditambahkan ke wallet!`);
      } else {
        alert(`❌ Gagal menambahkan ${token.name}.`);
      }
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (wallet && provider) {
      const loadBalances = async () => {
        const fromToken = new ethers.Contract(tokenFrom.address, TOKEN_ABI, provider);
        const toToken = new ethers.Contract(tokenTo.address, TOKEN_ABI, provider);
        const fromBal = await fromToken.balanceOf(wallet);
        const toBal = await toToken.balanceOf(wallet);
        setBalanceFrom(ethers.formatUnits(fromBal, 18));
        setBalanceTo(ethers.formatUnits(toBal, 18));
      };
      loadBalances();
    }
  }, [wallet, provider, tokenFrom, tokenTo]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md w-full shadow-2xl">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-bold text-center">🔁 Somnia Token Swap</h1>

          {wallet && (
            <div className="text-xs text-gray-500 text-center">
              {tokenFrom.name}: {parseFloat(balanceFrom).toFixed(4)} | {tokenTo.name}: {parseFloat(balanceTo).toFixed(4)}
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
                  <img src={tokenFrom.icon} alt={tokenFrom.name} className="w-6 h-6" />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder={`Amount in ${tokenFrom.name}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <Button size="sm" variant="secondary" onClick={switchTokens}>⇅ Switch</Button>
                </div>
                <div className="flex items-center gap-2">
                  <img src={tokenTo.icon} alt={tokenTo.name} className="w-6 h-6" />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    placeholder={`Estimated ${tokenTo.name}`}
                    value={amount}
                    disabled
                  />
                </div>
              </div>

              <Button className="w-full mt-4" onClick={handleSwap} disabled={!amount || loading}>
                {loading ? "Swapping..." : "Swap"}
              </Button>

              {txHash && (
                <div className="text-xs text-center mt-2 text-blue-600">
                  TX Hash: <a href={`https://shannon-explorer.somnia.network/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash.slice(0, 10)}...</a>
                </div>
              )}

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => addTokenToWallet(tokenFrom)} className="w-full text-xs">
                  + {tokenFrom.name} ke Wallet
                </Button>
                <Button variant="outline" onClick={() => addTokenToWallet(tokenTo)} className="w-full text-xs">
                  + {tokenTo.name} ke Wallet
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
