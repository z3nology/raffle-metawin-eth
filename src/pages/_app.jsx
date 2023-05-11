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
  const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 8000; // frequency provider is polling
    return library;
  };

  const getChainId = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    return library.chainId;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
    >
      <Web3ReactProvider getLibrary={getLibrary} chainId={getChainId}>
        <RaffleDataProvider>
          <Header />
          <Component {...pageProps} />
          <ToastContainer style={{ fontSize: 14 }} />
          {/* <Footer /> */}
        </RaffleDataProvider>
      </Web3ReactProvider>
    </motion.section>
  );
}

export default StakingApp;
