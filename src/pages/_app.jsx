import { ToastContainer } from "react-toastify";
import "../styles/style.scss";

import { motion } from "framer-motion";

import Header from "../components/Layout/Header";
import RaffleDataProvider from "../context/RaffleDataProvider";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

function StakingApp({ Component, pageProps }) {
  const { chains, publicClient } = configureChains(
    [sepolia],
    [
      alchemyProvider({ apiKey: "vTtWYrrUjx8zAWkVQSFpM1TQQSSdl_2V" }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: "METAWINs",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
      >
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <Header />
            <RaffleDataProvider>
              <Component {...pageProps} />
            </RaffleDataProvider>
            {/* {!metaMaskInstalled && (
              <div className="py-20 text-center">
                <p className="mb-4 text-lg text-gray-500">
                  Please Install MetaMask to use this app.
                </p>
                <a
                  href="https://metamask.io/download.html"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 font-bold text-white rounded bg-primary-color hover:bg-secondary-color focus:outline-none focus:shadow-outline"
                >
                  Download MetaMask
                </a>
              </div>
            )} */}
            <ToastContainer style={{ fontSize: 14 }} />
          </RainbowKitProvider>
        </WagmiConfig>
      </motion.section>
    </>
  );
}

export default StakingApp;
