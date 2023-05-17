/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected, switchNetwork } from "../../WalletHook/ConnectWallet";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import WalletModal from "../WalletModal";
import { DiscordIcon } from "../svgIcons";
import { PulseLoader } from "react-spinners";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { account, chainId, activate, deactivate } = useWeb3React();

  async function connect() {
    if (chainId !== 11155111 || chainId === undefined) {
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
  }, [router]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <>
      <nav className="fixed top-0 left-0 z-30 w-full py-2 transition-all duration-500 border-b nav-main border-cyan-500 lg:px-7 before:w-full before:h-full before:absolute before:-z-10 before:left-0 before:backdrop-blur-md before:transition-all before:duration-500 lg:before:hidden backdrop-blur-md bg-slate-900">
        <div className={"w-full flex justify-between items-center px-2 "}>
          <div className="flex justify-center lg:items-center border-b border-transparent bg-transparent transition-all lg:!bg-transparent lg:border-0  lg:border-cyan-500">
            <div className="block text-center grow-0">
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
            <div className="items-center justify-center hidden px-3 md:flex">
              <DiscordIcon color="#00d1ff" />
            </div>
          </div>
          <div className="justify-center hidden gap-5 text-center md:flex lg:text-left lg:mx-0 lg:pl-4">
            <div className="flex items-center justify-center gap-4">
              <Link href={"/"} passHref>
                <li
                  className={`text-lg font-normal ${
                    router.pathname === "/" ? "text-cyan-500" : "text-white"
                  } uppercase list-none transition-all duration-300 cursor-pointer hover:text-cyan-500`}
                >
                  competition
                </li>
              </Link>
              <Link href={"/createraffle"} passHref>
                <li
                  className={`text-lg font-normal ${
                    router.pathname === "/createraffle"
                      ? "text-cyan-500"
                      : "text-white"
                  } uppercase list-none transition-all duration-300 cursor-pointer hover:text-cyan-500`}
                >
                  create raffle
                </li>
              </Link>
            </div>
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
                onClick={() => connect()}
              >
                <span className="transition-all">
                  <span className="pr-3">Connect Wallet</span>
                </span>
              </button>
            )}
          </div>
          <div
            className="p-1 cursor-pointer md:hidden border-[1px] border-gray-400 hover:border-white duration-300 transition-all rounded-lg"
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu color="white" size={"30px"} />
          </div>
        </div>

        <WalletModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      </nav>
      {menuOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-50 items-center justify-center bg-black opacity-90 md:hidden">
          <div className="flex items-center justify-end w-full px-2 py-4">
            <div
              className="p-1 border-[1px] border-gray-300 hover:border-white duration-300 transition-all rounded-lg
            cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <IoMdClose color="white" size={"33px"} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col justify-center gap-5 text-center lg:text-left lg:mx-0 lg:pl-4">
              <div className="flex flex-col items-center justify-center gap-10">
                <Link href={"/"} passHref>
                  <li
                    className={`text-lg font-normal ${
                      router.pathname === "/" ? "text-cyan-500" : "text-white"
                    } uppercase list-none transition-all duration-300 cursor-pointer hover:text-cyan-500`}
                    onClick={() => setMenuOpen(false)}
                  >
                    competition
                  </li>
                </Link>
                <Link href={"/createraffle"} passHref>
                  <li
                    className={`text-lg font-normal ${
                      router.pathname === "/createraffle"
                        ? "text-cyan-500"
                        : "text-white"
                    } uppercase list-none transition-all duration-300 cursor-pointer hover:text-cyan-500`}
                    onClick={() => setMenuOpen(false)}
                  >
                    create raffle
                  </li>
                </Link>
              </div>
              {account ? (
                <button
                  className="text-sm py-3 px-6 bg-slate-800 border-2 border-cyan-500 text-white rounded-full tracking-widest uppercase hover:bg-slate-900 hover:border-cyan-200 transition-all focus:bg-slate-800 focus:border-cyan-200 relative shadow-[0_0_2px_0] shadow-cyan-500 disabled:bg-slate-800 disabled:hover:bg-slate-800"
                  onClick={() => {
                    disconnect();
                    setMenuOpen(false);
                  }}
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
                  onClick={() => {
                    openModal();
                    setMenuOpen(false);
                  }}
                >
                  <span className="transition-all">
                    <span className="pr-3">Connect Wallet</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
