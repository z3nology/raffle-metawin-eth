import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "../styles/style.scss";

import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { motion } from "framer-motion";

import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import RaffleDataProvider from "../context/RaffleDataProvider";

function StakingApp({ Component, pageProps }) {
  const [metaMaskInstalled, setMetaMaskInstalled] = useState(false);

  const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 8000; // frequency provider is polling
    return library;
  };

  const getChainId = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    return library.chainId;
  };

  async function checkMetaMaskInstalled() {
    if (typeof window === "undefined" || !window?.ethereum) {
      console.log("MetaMask is not installed");
      return;
    }

    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      setMetaMaskInstalled(true);
      console.log("MetaMask is installed with address:", accounts[0]);
    } catch (error) {
      console.log("Failed to connect to MetaMask:", error.message);
    }
  }

  if (!metaMaskInstalled) {
    checkMetaMaskInstalled();
  }

  return (
    <>
      {metaMaskInstalled ? (
        <Web3ReactProvider getLibrary={getLibrary} chainId={getChainId}>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
          >
            <Header />
            <RaffleDataProvider>
              <Component {...pageProps} />
            </RaffleDataProvider>
            <ToastContainer style={{ fontSize: 14 }} />
            {/* <Footer /> */}
          </motion.section>
        </Web3ReactProvider>
      ) : (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
        >
          <Header />
          <RaffleDataProvider>
            <Component {...pageProps} />
          </RaffleDataProvider>
          {!metaMaskInstalled && (
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
          )}
          <ToastContainer style={{ fontSize: 14 }} />
          {/* <Footer /> */}
        </motion.section>
      )}
    </>
  );
}

export default StakingApp;
