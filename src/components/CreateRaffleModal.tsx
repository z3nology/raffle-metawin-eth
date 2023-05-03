/* eslint-disable @next/next/no-img-element */

import { Dialog, Transition } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { CONTRACT_ADDR } from "../config";

import { AiOutlineCloseCircle } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { max } from "moment";
import { errorAlert, successAlert } from "./toastGroup";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  startLoading: () => void;
  endLoading: () => void;
  collateralIDArray: number[];
}

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

interface priceType {
  id: number;
  numEntries: number;
  price: number;
}

export default function CreateRaffleModal({
  isOpen,
  closeModal,
  collateralIDArray,
  startLoading,
  endLoading,
}: Props) {
  const { account } = useWeb3React();

  const [loadingState, setLoadingState] = useState<boolean>(false);

  const [desiredFundsInWeis, setDesiredFundsInWeis] = useState<number>(0);
  const [maxEntriesPerUser, setMaxEntriesPerUser] = useState<number>(1);
  const [collateralAddrDatas, setCollateralAddrDatas] = useState<string[]>([
    "",
  ]);
  const [minimumFundsInWeis, setMinimumFundsInWeis] = useState<number>(0);
  const [prices, setPrices] = useState<priceType[]>([]);
  const [commissionInBasicPoints, setCommissionInBasicPoints] =
    useState<number>(0);
  const [collectionWhitelist, setCollectionWhiteList] = useState<string[]>([
    "",
  ]);
  const [collectionFreeTickets, setCollectionFreeTickets] = useState<string[]>([
    "",
  ]);

  // Get raffle contract
  const provider =
    typeof window !== "undefined" && (window as WindowWithEthereum).ethereum
      ? new ethers.providers.Web3Provider(
          (window as WindowWithEthereum).ethereum
        )
      : null;
  const Signer = provider?.getSigner();

  const NFTCONTRACT = new ethers.Contract(
    CONTRACT_ADDR,
    RaffleCOTRACTABI,
    Signer
  );

  // Define the createRaffle function
  const handleCreateRaffleFunc = async () => {
    startLoading();
    await NFTCONTRACT.createRaffle(
      desiredFundsInWeis,
      maxEntriesPerUser,
      collateralAddrDatas,
      collateralIDArray,
      minimumFundsInWeis,
      prices,
      commissionInBasicPoints,
      collectionWhitelist,
      collectionFreeTickets,
      { gasLimit: 1000000 }
    )
      .then((tx: any) => {
        tx.wait()
          .then(() => {
            successAlert("Created Successful.");
            closeModal();
            endLoading();
          })
          .catch(() => {
            errorAlert("Create Failed.");
            endLoading();
          });
      })
      .catch(() => {
        errorAlert("Create Failed.");
        endLoading();
      });
  };

  const getCreatedRaffles = async () => {
    await NFTCONTRACT.raffles(1).then((data: any) => {
      console.log(data.length);
    });
  };

  useEffect(() => {
    if (account) {
      getCreatedRaffles();
    }

    // eslint-disable-next-line
  }, [account]);

  useEffect(() => {
    console.log(prices);
  }, [prices]);

  // Set the div of price div
  const inputFields = [];
  for (let i = 0; i < maxEntriesPerUser; i++) {
    inputFields.push(
      <div className="flex items-center justify-between w-full gap-3 py-1">
        <input
          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
          type="number"
          placeholder="_prices.id"
          onChange={(e) => handleInputChange(i, "id", e.target.value)}
        />
        <input
          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
          type="number"
          placeholder="_prices.numEntries"
          onChange={(e) => handleInputChange(i, "numEntries", e.target.value)}
        />
        <input
          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
          type="number"
          placeholder="_prices"
          onChange={(e) => handleInputChange(i, "price", e.target.value)}
        />
      </div>
    );
  }

  const handleInputChange = (
    index: number,
    field: keyof priceType,
    value: string
  ) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: Number(value) };
    setPrices(updatedPrices);
  };

  const clearAll = () => {
    setDesiredFundsInWeis(0);
    setMaxEntriesPerUser(1);
    setCollateralAddrDatas([""]);
    setMinimumFundsInWeis(0);
    setCommissionInBasicPoints(0);
    setCollectionWhiteList([""]);
    setCollectionFreeTickets([""]);
  };

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
                  min-h-[40vh] z-50 bg-[#04111d]"
                >
                  <div className="flex items-center justify-end w-full">
                    <div
                      className="cursor-pointer "
                      onClick={() => {
                        closeModal();
                        clearAll();
                      }}
                    >
                      <AiOutlineCloseCircle color="white" size={30} />
                    </div>
                  </div>
                  <Dialog.Title
                    as="h1"
                    className="text-3xl font-medium leading-6 text-center text-white uppercase"
                  >
                    {`+ Create Raffle`}
                  </Dialog.Title>
                  <div className="flex flex-col w-full gap-4 mt-4">
                    <input
                      className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      type="number"
                      placeholder="_desiredFundsInWeis"
                      onChange={(e) =>
                        setDesiredFundsInWeis(Number(e.target.value))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      type="number"
                      placeholder="_maxEntriesPerUser"
                      max={5}
                      onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value === 0) {
                          setMaxEntriesPerUser(1);
                        } else if (value > 5) {
                          setMaxEntriesPerUser(5);
                        } else {
                          setMaxEntriesPerUser(value);
                        }
                      }}
                    />
                    <div className="w-full border-[2px] border-dashed border-gray-700" />

                    {collateralAddrDatas.map((data, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between w-full gap-5"
                      >
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="text"
                          placeholder="_collateralAddress"
                          value={data}
                          onChange={(e) => {
                            const newArr = [...collateralAddrDatas];
                            newArr[idx] = e.target.value;
                            setCollateralAddrDatas(newArr);
                          }}
                        />
                        {idx > 0 && (
                          <div
                            className="text-2xl text-white cursor-pointer"
                            onClick={() => {
                              const newArr = [...collateralAddrDatas];
                              newArr.splice(idx, 1);
                              setCollateralAddrDatas(newArr);
                            }}
                          >
                            {" x "}
                          </div>
                        )}
                        {idx === collateralAddrDatas.length - 1 && (
                          <div
                            className="text-3xl text-white cursor-pointer"
                            onClick={() =>
                              setCollateralAddrDatas([
                                ...collateralAddrDatas,
                                "",
                              ])
                            }
                          >
                            {" + "}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="w-full border-[2px] border-dashed border-gray-700" />

                    <input
                      className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      type="text"
                      placeholder="_collateralId"
                      id="_collateralId"
                      value={collateralIDArray.toString()}
                      readOnly
                    />
                    <input
                      className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      type="number"
                      placeholder="_minimumFundsInWeis"
                      onChange={(e) =>
                        setMinimumFundsInWeis(Number(e.target.value))
                      }
                    />
                    <div className="w-full border-[2px] border-dashed border-gray-700" />
                    {inputFields}
                    {/* {maxEntriesPerUser.map((data, index) => (
                      <div
                        className="flex items-center justify-between w-full gap-3 py-1"
                        key={index}
                      >
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="number"
                          placeholder="_prices.id"
                          onChange={(e) =>
                            setPrices((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? { ...item, id: Number(e.target.value) }
                                  : item
                              )
                            )
                          }
                          value={prices[index].id}
                        />
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="number"
                          placeholder="_prices.numEntries"
                          onChange={(e) =>
                            setPrices((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      numEntries: Number(e.target.value),
                                    }
                                  : item
                              )
                            )
                          }
                          value={prices[index].numEntries}
                        />
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="number"
                          placeholder="_prices"
                          onChange={(e) =>
                            setPrices((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? { ...item, price: Number(e.target.value) }
                                  : item
                              )
                            )
                          }
                          value={prices[index].price}
                        />
                      </div>
                    ))} */}
                    <div className="w-full border-[2px] border-dashed border-gray-700" />

                    <input
                      className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      type="number"
                      placeholder="_commissionInBasicPoints"
                      onChange={(e) =>
                        setCommissionInBasicPoints(Number(e.target.value))
                      }
                    />
                    <div className="w-full border-[2px] border-dashed border-gray-700" />

                    {collectionWhitelist.map((data, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between w-full gap-5"
                      >
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="text"
                          placeholder="_collectionWhitelist"
                          value={data}
                          onChange={(e) => {
                            const newArr = [...collectionWhitelist];
                            newArr[idx] = e.target.value;
                            setCollectionWhiteList(newArr);
                          }}
                        />
                        {idx > 0 && (
                          <div
                            className="text-2xl text-white cursor-pointer"
                            onClick={() => {
                              const newArr = [...collectionWhitelist];
                              newArr.splice(idx, 1);
                              setCollectionWhiteList(newArr);
                            }}
                          >
                            {" x "}
                          </div>
                        )}
                        {idx === collectionWhitelist.length - 1 && (
                          <div
                            className="text-3xl text-white cursor-pointer"
                            onClick={() =>
                              setCollectionWhiteList([
                                ...collateralAddrDatas,
                                "",
                              ])
                            }
                          >
                            {" + "}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="w-full border-[2px] border-dashed border-gray-700" />
                    {collectionFreeTickets.map((data, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between w-full gap-5"
                      >
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="text"
                          placeholder="_collectionFreeTickets"
                          value={data}
                          onChange={(e) => {
                            const newArr = [...collectionFreeTickets];
                            newArr[idx] = e.target.value;
                            setCollectionFreeTickets(newArr);
                          }}
                        />
                        {idx > 0 && (
                          <div
                            className="text-2xl text-white cursor-pointer"
                            onClick={() => {
                              const newArr = [...collectionFreeTickets];
                              newArr.splice(idx, 1);
                              setCollectionFreeTickets(newArr);
                            }}
                          >
                            {" x "}
                          </div>
                        )}
                        {idx === collectionFreeTickets.length - 1 && (
                          <div
                            className="text-3xl text-white cursor-pointer"
                            onClick={() =>
                              setCollectionFreeTickets([
                                ...collectionFreeTickets,
                                "",
                              ])
                            }
                          >
                            {" + "}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center w-full my-5">
                    <button
                      className="text-sm py-3 px-6 bg-slate-800 border-2 border-cyan-500 text-white rounded-full tracking-widest uppercase hover:bg-slate-900 hover:border-cyan-200 transition-all focus:bg-slate-800 focus:border-cyan-200 relative shadow-[0_0_2px_0] shadow-cyan-500 disabled:bg-slate-800 disabled:hover:bg-slate-800"
                      onClick={() => handleCreateRaffleFunc()}
                    >
                      <span className="transition-all">
                        <span className="pr-3">{`+ Create Raffle`}</span>
                      </span>
                    </button>
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
