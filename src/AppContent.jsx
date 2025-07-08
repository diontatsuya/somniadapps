import { usePrivy, useWallets } from "@privy-io/react-auth";
import SwapForm from "./components/SwapForm";

export default function AppContent() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const wallet = wallets[0];
  const provider = wallet?.getEthersProvider();

  if (!ready) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">🎮 Somnia Token Swap</h1>

      {authenticated ? (
        <>
          <div className="text-sm mb-2">👛 Wallet: {wallet?.address}</div>
          <button onClick={logout} className="text-blue-600 underline mb-4">
            Log Out
          </button>
          <SwapForm provider={provider} />
        </>
      ) : (
        <button onClick={login} className="bg-blue-500 text-white p-2 rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
}
