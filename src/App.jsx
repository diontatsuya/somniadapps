import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";
import AppContent from "./AppContent";
import "./index.css";

const { publicClient } = configureChains([mainnet], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  publicClient,
});

export default function App() {
  return (
    <PrivyProvider appId="cmcn6y46j00mnl40m3u5bee9v">
      <WagmiConfig config={config}>
        <AppContent />
      </WagmiConfig>
    </PrivyProvider>
  );
}
