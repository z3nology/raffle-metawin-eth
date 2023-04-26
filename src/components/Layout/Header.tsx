/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected, switchNetwork } from "../../WalletHook/ConnectWallet";
import { FaWallet } from "react-icons/fa";
import WalletModal from "../WalletModal";
import { DiscordIcon } from "../svgIcons";

export default function Header() {
  const router = useRouter();
  // const [open, setOpen] = useState(false);

  const { account, chainId, activate, deactivate } = useWeb3React();

  async function connect() {
    if (chainId !== 1 || chainId === undefined) {
      switchNetwork();
    }
    try {
      console.log("clicked");
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", "false");
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", "true");
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <nav className="fixed top-0 left-0 z-30 w-full transition-all duration-500 bg-black nav-main lg:border-cyan-500 lg:border-b lg:px-7 before:w-full before:h-full before:absolute before:-z-10 before:left-0 before:backdrop-blur-md before:transition-all before:duration-500 lg:before:hidden lg:backdrop-blur-md lg:bg-slate-900">
      <div className={"w-full flex justify-between items-center px-2 "}>
        <div className="flex justify-center lg:items-center border-b border-transparent bg-black transition-all lg:!bg-transparent lg:border-0  lg:border-cyan-500">
          <div className="text-center grow-0">
            <div
              aria-current="page"
              className="router-link-active router-link-exact-active inline-block w-[138px] mx-1 lg:w-[165px] cursor-pointer"
            >
              <Link href={"/"} passHref>
                <img
                  src="https://metawin.com/_nuxt/MetaWin-logo-white.02822cdb.svg"
                  alt="MetaWin logo"
                  width="165"
                  height="24"
                  className="inline-block w-full py-5 transition-all lg:py-5"
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center px-3">
            <DiscordIcon color="#00d1ff" />
          </div>
        </div>
        <div className="justify-center block text-center lg:text-left lg:mx-0 lg:flex lg:pl-4">
          {account ? (
            <button
              className="text-sm py-3 px-6 bg-slate-800 border-2 border-cyan-500 text-white rounded-full tracking-widest uppercase hover:bg-slate-900 hover:border-cyan-200 transition-all focus:bg-slate-800 focus:border-cyan-200 relative shadow-[0_0_2px_0] shadow-cyan-500 disabled:bg-slate-800 disabled:hover:bg-slate-800"
              onClick={() => disconnect()}
            >
              <span className="transition-all">
                <span className="pr-3">
                  {account.slice(0, 4)} {`...`} {account.slice(-4)}
                </span>
              </span>
            </button>
          ) : (
            <button
              className="text-sm py-3 px-6 bg-slate-800 border-2 border-cyan-500 text-white rounded-full tracking-widest uppercase hover:bg-slate-900 hover:border-cyan-200 transition-all focus:bg-slate-800 focus:border-cyan-200 relative shadow-[0_0_2px_0] shadow-cyan-500 disabled:bg-slate-800 disabled:hover:bg-slate-800"
              onClick={() => openModal()}
            >
              <span className="transition-all">
                <span className="pr-3">Connect Wallet</span>
              </span>
            </button>
          )}
        </div>
      </div>
      <WalletModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </nav>
  );
}
