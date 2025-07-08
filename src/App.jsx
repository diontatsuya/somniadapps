import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { TOKEN_A, TOKEN_B, SWAP_CONTRACT } from "./constants/addresses";
import { universalTokenSwapAbi } from "./abi/universalTokenSwapAbi";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [amount, setAmount] = useState("");
  const [estimate, setEstimate] = useState("");
  const [tokenIn, setTokenIn] = useState(TOKEN_A);
  const [tokenOut, setTokenOut] = useState(TOKEN_B);
  const [isSwapping, setIsSwapping] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");

  const connectWallet = async () => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const signer = await prov.getSigner();
      const addr = await signer.getAddress();
      setProvider(prov);
      setSigner(signer);
      setWallet(addr);
    } else {
      alert("🦊 MetaMask tidak ditemukan. Silakan pasang MetaMask.");
    }
  };

  const disconnect = () => {
    setWallet(null);
    setProvider(null);
    setSigner(null);
    setAmount("");
    setEstimate("");
    setTxHash("");
  };

  const switchTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setEstimate("");
    setAmount("");
    setTxHash("");
  };

  const getEstimate = async () => {
    if (!signer || !amount || Number(amount) <= 0) return;
    try {
      const contract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, provider);
      const raw = ethers.parseUnits(amount, 18);
      const estimated = await contract.estimateSwap(tokenIn.address, tokenOut.address, raw);
      setEstimate(ethers.formatUnits(estimated, 18));
    } catch (err) {
      console.error("Estimate error:", err);
      setEstimate("0");
    }
  };

  const approveIfNeeded = async () => {
    const token = new ethers.Contract(tokenIn.address, [
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)"
    ], signer);

    const allowance = await token.allowance(wallet, SWAP_CONTRACT);
    const rawAmount = ethers.parseUnits(amount, 18);

    if (allowance < rawAmount) {
      const tx = await token.approve(SWAP_CONTRACT, ethers.parseUnits("1000000", 18));
      await tx.wait();
    }
  };

  const getBalance = async () => {
    if (!wallet || !provider) return;
    try {
      const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"];
      const tokenA = new ethers.Contract(TOKEN_A.address, erc20Abi, provider);
      const tokenB = new ethers.Contract(TOKEN_B.address, erc20Abi, provider);
      const [balA, balB] = await Promise.all([
        tokenA.balanceOf(wallet),
        tokenB.balanceOf(wallet)
      ]);
      setBalanceA(ethers.formatUnits(balA, 18));
      setBalanceB(ethers.formatUnits(balB, 18));
    } catch (err) {
      console.error("Balance fetch failed:", err);
    }
  };

  const swap = async () => {
    if (!wallet || !signer) {
      alert("❗ Wallet belum terkoneksi.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("❗ Masukkan jumlah token yang valid.");
      return;
    }

    setIsSwapping(true);
    setTxHash("");
    try {
      await approveIfNeeded();
      const contract = new ethers.Contract(SWAP_CONTRACT, universalTokenSwapAbi, signer);
      const tx = await contract.swap(tokenIn.address, tokenOut.address, ethers.parseUnits(amount, 18));
      setTxHash(tx.hash);
      await tx.wait();
      alert("✅ Swap berhasil!");
      setAmount("");
      setEstimate("");
      getBalance();
    } catch (err) {
      console.error("Swap error:", err);
      alert("❌ Swap gagal: " + (err.reason || err.message || "Terjadi kesalahan"));
    } finally {
      setIsSwapping(false);
    }
  };

  const addTokenToWallet = async (token) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
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
    } catch (err) {
      console.error("Add token failed:", err);
    }
  };

  useEffect(() => {
    getEstimate();
    getBalance();
  }, [amount, tokenIn, tokenOut, wallet]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">💱 Universal Swap DApp</h1>

        {!wallet ? (
          <button onClick={connectWallet} className="bg-blue-500 text-white w-full py-2 rounded">
            Connect MetaMask
          </button>
        ) : (
          <>
            <div className="text-xs text-gray-500 truncate">Wallet: {wallet}</div>
            <div className="text-sm text-gray-600">
              💰 {TOKEN_A.name}: {balanceA} | {TOKEN_B.name}: {balanceB}
            </div>
            <button onClick={disconnect} className="bg-red-500 text-white w-full py-1 rounded mt-1">
              Log Out
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img src={tokenIn.icon} alt={tokenIn.name} className="w-6 h-6" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                  placeholder={`Amount in ${tokenIn.name}`}
                />
              </div>

              <button onClick={switchTokens} className="w-full text-center text-gray-600">
                🔁 Switch
              </button>

              <div className="flex items-center gap-2">
                <img src={tokenOut.icon} alt={tokenOut.name} className="w-6 h-6" />
                <input
                  type="text"
                  value={estimate}
                  disabled
                  className="w-full px-2 py-1 border rounded bg-gray-100"
                  placeholder={`Estimated ${tokenOut.name}`}
                />
              </div>
            </div>

            <button
              onClick={swap}
              disabled={isSwapping}
              className={`w-full py-2 rounded mt-4 text-white ${isSwapping ? "bg-gray-400" : "bg-green-500"}`}
            >
              {isSwapping ? "Swapping..." : "Swap Now"}
            </button>

            {txHash && (
              <div className="text-xs text-center mt-2 text-blue-600">
                TX: <a href={`https://shannon-explorer.somnia.network/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash.slice(0, 10)}...</a>
              </div>
            )}

            <div className="flex justify-between gap-2 mt-3">
              <button
                onClick={() => addTokenToWallet(TOKEN_A)}
                className="flex-1 text-sm bg-yellow-400 text-black py-1 rounded"
              >
                Add {TOKEN_A.name}
              </button>
              <button
                onClick={() => addTokenToWallet(TOKEN_B)}
                className="flex-1 text-sm bg-purple-500 text-white py-1 rounded"
              >
                Add {TOKEN_B.name}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
                }
