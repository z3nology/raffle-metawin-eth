/* eslint-disable @next/next/no-img-element */

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { switchNetwork, injected } from "../WalletHook/ConnectWallet";
import { useWeb3React } from "@web3-react/core";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

export default function WalletModal({ isOpen, closeModal }: Props) {
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

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-70">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all
                min-h-[20vh] z-50 bg-[#04111d]"
                >
                  <Dialog.Title
                    as="h1"
                    className="text-3xl font-medium leading-6 text-center text-white uppercase"
                  >
                    connect wallet
                  </Dialog.Title>
                  <p className="my-5 text-center text-gray-500 text-md">
                    Choose a wallet connection method.
                  </p>
                  <div
                    className="relative flex items-center w-full p-3 transition-all duration-300 rounded-lg outline-none cursor-pointer bg-slate-800 hover:bg-slate-700"
                    onClick={() => {
                      connect();
                      closeModal();
                    }}
                  >
                    <img
                      src="/img/metamask-logo.png"
                      alt="metamask-logo"
                      className="w-[30px] h-[30px] absolute left-2 top-[8px]"
                    />
                    <h1 className="w-full text-center text-white uppercase">
                      Metamask
                    </h1>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
