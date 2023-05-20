/* eslint-disable @next/next/no-img-element */
import { useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { RAFFLECONTRACT_ADDR } from "../config";

import { AiOutlineCloseCircle } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { max } from "moment";
import { errorAlert, successAlert } from "./toastGroup";
import { WindowWithEthereum } from "../types";
import { useRouter } from "next/router";
import { RaffleDataContext } from "../context/RaffleDataProvider";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  startLoading: () => void;
  endLoading: () => void;
  collateralIDArray: number[];
  collectionAddrArray: string[];
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
  collectionAddrArray,
  startLoading,
  endLoading,
}: Props) {
  const { account } = useWeb3React();
  const router = useRouter();

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [endTimeStamp, setEndTimeStamp] = useState(0);
  const [desiredFundsInWeis, setDesiredFundsInWeis] = useState<number>(0);
  const [maxEntriesPerUser, setMaxEntriesPerUser] = useState<number>(1);
  const [collateralAddrDatas, setCollateralAddrDatas] = useState<string[]>([
    "",
  ]);
  const [tokenAmount, setTokenAmount] = useState<number[]>([0]);

  const [minimumFundsInWeis, setMinimumFundsInWeis] = useState<number>(0);
  const [prices, setPrices] = useState<priceType[]>([
    { id: 1, numEntries: 1, price: 0 },
  ]);
  const [commissionInBasicPoints, setCommissionInBasicPoints] =
    useState<number>(0);
  const [collectionWhitelist, setCollectionWhiteList] = useState<string[]>([
    "",
  ]);

  const { getRaffleData } = useContext(RaffleDataContext);

  // Get raffle contract
  const provider =
    typeof window !== "undefined" && (window as WindowWithEthereum).ethereum
      ? new ethers.providers.Web3Provider(
          (window as WindowWithEthereum).ethereum
        )
      : null;
  const Signer = provider?.getSigner();

  const RAFFLECONTRACT = new ethers.Contract(
    RAFFLECONTRACT_ADDR,
    RaffleCOTRACTABI,
    Signer
  );

  // Define the createRaffle function
  const handleCreateRaffleFunc = async () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (endTimeStamp < currentTimestamp) {
      errorAlert("EndTime must be!");
    } else if (
      prices.filter((data) => data.numEntries === 0).length !== 0 ||
      prices.filter((data) => data.price === 0).length !== 0
    ) {
      errorAlert("Please input the correct price data!");
    } else {
      startLoading();
      await RAFFLECONTRACT.createRaffle(
        endTimeStamp,
        desiredFundsInWeis,
        maxEntriesPerUser,
        collectionAddrArray,
        collateralIDArray,
        tokenAmount,
        minimumFundsInWeis,
        prices,
        collectionWhitelist,
        { gasLimit: 300000000 }
      )
        .then((tx: any) => {
          tx.wait()
            .then(() => {
              successAlert("Created Successful.");
              closeModal();
              getRaffleData();
              endLoading();
              router.push("/");
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
    }
  };

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
        <div className="text-2xl text-white cursor-pointer">{" x "}</div>

        <div className="text-3xl text-white cursor-pointer">{" + "}</div>
      </div>
    );
  }

  const handleInputChange = (
    index: number,
    field: keyof priceType,
    value: string
  ) => {
    let parsedValue: string | ethers.BigNumber;

    if (field === "price") {
      parsedValue = ethers.utils.parseEther(value.toString());
    } else {
      parsedValue = value;
    }

    const updatedPrices = [...prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: parsedValue };
    setPrices(updatedPrices);
  };

  // add new price object by clicking the '+'
  const handleAddPrice = () => {
    if (prices.length < 5)
      setPrices([
        ...prices,
        {
          id: 0,
          numEntries: 0,
          price: 0,
        },
      ]);
  };

  // remove price object at given index by clicking the 'x'
  const handleRemovePrice = (index: number) => {
    console.log("index", index);
    if (prices.length === 1) {
      // cannot delete if only one price object left
      return;
    }
    const updatedPrices = [...prices];
    updatedPrices.splice(index, 1);
    console.log("updatedPrices", updatedPrices);
    setPrices(updatedPrices);
  };

  useEffect(() => {
    console.log("prices", prices);
  }, [prices]);

  const getDateTime = (e: any) => {
    const timeStamp = Date.parse(e);
    setEndTimeStamp(Math.floor(timeStamp / 1000));
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
                      type="datetime-local"
                      id="datetime"
                      name="datetime"
                      className="px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      onChange={(e) => getDateTime(e.target.value)}
                    />

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
                        } else {
                          setMaxEntriesPerUser(value);
                        }
                      }}
                    />
                    <div className="w-full border-[2px] border-dashed border-gray-700" />

                    {collectionAddrArray?.map((data, index) => (
                      <input
                        id="_collectionAddrArray"
                        key={index}
                        className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                        type="string"
                        value={data}
                        placeholder="_collateralAddress"
                        readOnly
                      />
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
                    {collectionAddrArray.map((data, index) => (
                      <input
                        key={index}
                        className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                        type="number"
                        placeholder="_tokenAmount"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setTokenAmount((prevState) => {
                            const updatedArray = [...prevState];
                            updatedArray[index] = value;
                            return updatedArray;
                          });
                        }}
                      />
                    ))}

                    <input
                      className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      type="number"
                      placeholder="_minimumFundsInWeis"
                      onChange={(e) =>
                        setMinimumFundsInWeis(Number(e.target.value))
                      }
                    />
                    <div className="w-full border-[2px] border-dashed border-gray-700" />
                    {prices.map((priceData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between w-full gap-3 py-1"
                      >
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="number"
                          placeholder="_prices.id"
                          onChange={(e) =>
                            handleInputChange(index, "id", e.target.value)
                          }
                        />
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="number"
                          placeholder="_prices.numEntries"
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "numEntries",
                              e.target.value
                            )
                          }
                        />
                        <input
                          className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                          type="number"
                          placeholder="_prices"
                          onChange={(e) =>
                            handleInputChange(index, "price", e.target.value)
                          }
                        />
                        {prices.length > 1 && (
                          <div
                            className="text-2xl text-white cursor-pointer"
                            onClick={() => handleRemovePrice(index)}
                          >
                            {"x"}
                          </div>
                        )}
                        <div
                          className="text-3xl text-white cursor-pointer"
                          onClick={handleAddPrice}
                        >
                          {"+"}
                        </div>
                      </div>
                    ))}
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
                    {}

                    <input
                      className="w-full px-3 py-2 text-white bg-gray-800 rounded-lg outline-none"
                      type="text"
                      placeholder="_collectionWhitelist"
                      onChange={(e) => setCollectionWhiteList([e.target.value])}
                    />
                    <div className="w-full border-[2px] border-dashed border-gray-700" />
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
