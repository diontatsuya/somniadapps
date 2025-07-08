import { PrivyProvider } from "@privy-io/react-auth";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import SwapForm from "./components/SwapForm";

function ConnectedApp() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  if (!ready) return <div className="text-center mt-8">Loading Privy...</div>;

  if (!authenticated)
    return (
      <div className="text-center mt-8">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
          onClick={login}
        >
          Connect Wallet
        </button>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>👛 {wallet?.address}</div>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <SwapForm provider={wallet?.externalProvider} />
    </div>
  );
}

export default function App() {
  return (
    <PrivyProvider
      appId="cmcn6y46j00mnl40m3u5bee9v"
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <ConnectedApp />
    </PrivyProvider>
  );
}
