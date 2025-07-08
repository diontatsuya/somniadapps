import { usePrivy, useWallets } from "@privy-io/react-auth";
import SwapForm from "./components/SwapForm";

function App() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  if (!ready) return <div className="p-4 text-center">🔄 Loading...</div>;

  if (!authenticated)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
          onClick={login}
        >
          Connect Wallet
        </button>
      </div>
    );

  const wallet = wallets[0];
  const address = wallet?.address;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-gray-800 p-4">
      <div className="max-w-xl mx-auto rounded-2xl shadow-xl p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">💱 Somnia Token Swap</h1>
            <p className="text-sm text-gray-500">Swap GOLD ↔ GEM ↔ STT</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Address:</p>
            <p className="text-sm font-mono">{address}</p>
            <button
              className="text-xs text-blue-500 hover:underline mt-1"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
        <SwapForm />
      </div>
    </div>
  );
}

export default App;
