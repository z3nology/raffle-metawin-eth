/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RaffleDataContext } from "../context/RaffleDataProvider";
import { useWeb3React } from "@web3-react/core";
import Slider from "react-slick";
import { ethers } from "ethers";
import { RAFFLECONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { errorAlert, successAlert } from "../components/toastGroup";
import { PulseLoader } from "react-spinners";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CardProps, PriceDataType } from "../types";

export default function Buy() {
  const { account, chainId, activate, deactivate } = useWeb3React();
  const router = useRouter();
  const { createdRaffleData, getRaffleData } = useContext(RaffleDataContext);
  const [priceArray, setPrice] = useState<PriceDataType[]>([]);
  const [currentTicketCount, setCurrentTicketCount] = useState<number>(0);
  const [collateralIDArray, setCollateralIDArray] = useState<String[]>([]);
  const [filterDataByID, setFilterDataByID] = useState<CardProps[]>([]);
  const [loadingState, setLoadingState] = useState(false);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 500,
    fade: true,
  };

  interface WindowWithEthereum extends Window {
    ethereum?: any;
  }

  // Get raffle contract
  const provider =
    typeof window !== "undefined" && (window as WindowWithEthereum).ethereum
      ? new ethers.providers.Web3Provider(
          (window as WindowWithEthereum).ethereum
        )
      : null;
  const Signer = provider?.getSigner();

  const provider2 = new ethers.providers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/fe5e2547673f42af99e7bd9dc2d8de1e"
  );

  const RAFFLECONTRACT = new ethers.Contract(
    RAFFLECONTRACT_ADDR,
    RaffleCOTRACTABI,
    provider2
  );

  const handleBuyFunc = async (id: number, price: number) => {
    const raffleId = localStorage.getItem("raffleId");
    const currentTimestamp: number = new Date().getTime();
    if (filterDataByID[0].status !== 1) {
      errorAlert("Raffle is not in accepted");
    } else if (
      currentTicketCount + Number(priceArray[id]?.numEntries) >=
      filterDataByID[0].maxEntries
    ) {
      errorAlert("Bought too many entries");
    } else {
      if (Number(filterDataByID[0].endTime) * 1000 > currentTimestamp) {
        setLoadingState(true);
        await RAFFLECONTRACT.buyEntry(
          Number(raffleId),
          id,
          "0x0000000000000000000000000000000000000000",
          0,
          {
            value: ethers.utils.parseEther(price.toString()),
            gasLimit: 300000,
          }
        )
          .then((tx: any) => {
            tx.wait()
              .then(() => {
                successAlert("Created Successful.");
                router.push("/");
                setLoadingState(false);
              })
              .catch(() => {
                errorAlert("Created Failed.");
                setLoadingState(false);
              });
          })
          .catch(() => {
            errorAlert("Created Failed.");
            setLoadingState(false);
          });
      } else {
        errorAlert("Raffle was ended.");
      }
    }
  };

  useEffect(() => {
    setLoadingState(true);
    if (localStorage.getItem("raffleId") !== undefined) {
      const dataById = createdRaffleData.filter(
        (data) => data.raffleId === Number(localStorage.getItem("raffleId"))
      );
      setFilterDataByID(dataById);
      setCollateralIDArray(dataById[0]?.collateralId);
      setLoadingState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdRaffleData]);

  const getPriceData = async () => {
    setLoadingState(true);

    const raffleId = Number(localStorage.getItem("raffleId"));
    const priceData: any[] = [];
    if (createdRaffleData && filterDataByID[0]?.maxEntries)
      for (let i = 0; i < filterDataByID[0].maxEntries; i++) {
        await RAFFLECONTRACT.prices(raffleId, i).then((data: any) => {
          if (Number(data.numEntries) === 0) return;
          priceData.push({
            id: i + 1,
            numEntries: Number(data.numEntries),
            price: Number(
              parseFloat(
                ethers.utils.formatEther(data.price.toString())
              ).toFixed(6)
            ),
          });
        });
      }
    setPrice(priceData);
    setLoadingState(false);
  };

  useEffect(() => {
    if (filterDataByID) getPriceData();
    // eslint-disable-next-line
  }, [filterDataByID]);

  const handleAcceptRaffleFunc = async () => {
    setLoadingState(true);

    const raffleId = Number(localStorage.getItem("raffleId"));
    await RAFFLECONTRACT.AcceptRaffle(raffleId, { gasLimit: 3000000 })
      .then((tx: any) => {
        tx.wait()
          .then(() => {
            successAlert("Accepted the raffle");
            setLoadingState(false);
            getRaffleData();
          })
          .catch(() => {
            errorAlert("Accept failed");
            setLoadingState(false);
            getRaffleData();
          });
      })
      .catch(() => {
        errorAlert("Accept failed");
        setLoadingState(false);
        getRaffleData();
      });
  };

  const getEntriesByRaffleId = async () => {
    const raffleId = Number(localStorage.getItem("raffleId"));
    let count = 0;
    const data = await RAFFLECONTRACT.getEntriesBought(raffleId);
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].player === account) {
        count +=
          Number(data[i].currentEntriesLength) -
          (i == 0 ? 0 : Number(data[i - 1].currentEntriesLength));
      }
    }
    setCurrentTicketCount(count);
  };

  useEffect(() => {
    if (account) getEntriesByRaffleId();
    // eslint-disable-next-line
  }, [account]);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-24 lg:mt-40 xl:px-[200px] 2xl:px-[300px] px-[10px] md:px-[100px]">
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="w-full">
          <Slider {...settings} className="rounded-lg" cssEase="ease-in-out">
            {collateralIDArray?.map((data, index) => (
              <img
                src={
                  "https://ipfs.io/ipfs/QmPzwKUJ4yVEXX62hkhVrZ4azXrrERcKwB4z1dyKKFJEva/" +
                  data +
                  ".png"
                }
                key={index}
                className="object-cover w-full rounded-xl min-h-[27vh]"
                alt=""
              />
            ))}
          </Slider>
        </div>
        <div className="flex items-center justify-center">
          <div
            className="xl:max-w-[900px] rounded-2xl p-6 text-left shadow-xl transition-all
                min-h-[70vh] z-20 bg-[#04111d] w-full"
          >
            <div className="text-3xl font-medium leading-6 text-center text-white uppercase">
              ENTER COMPETITION
            </div>
            <p className="my-5 text-center text-white text-md">
              You used{" "}
              <span className="text-blue-500">
                {currentTicketCount}
                entries
              </span>
            </p>
            <div className="w-full gap-3 mt-2 space-y-4 md:space-y-0 md:grid md:grid-cols-2">
              {priceArray.map((data, index) => (
                <div
                  className="flex flex-col justify-start items-center bg-[#131f2a] rounded-lg p-3 hover:scale-[1.02] duration-150 transition-all"
                  onClick={() => handleBuyFunc(index + 1, data.price)}
                  key={index}
                >
                  <h1 className="text-white font-bold text-[50px]">
                    {data.numEntries}
                  </h1>
                  <h1 className="text-xl font-bold text-white uppercase">
                    entry
                  </h1>
                  <button className="w-full py-3 my-3 font-bold text-white bg-blue-600 rounded-full">
                    {data.price}
                  </button>
                </div>
              ))}

              {/* <div className="gtm-card-package relative overflow-hidden transition-all cursor-pointer hover:scale-[1.02] bg-slate-600 p-0 rounded-xl last:odd:col-span-2">
                <img
                  src="data:image/png;base64,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"
                  alt=""
                  width="156"
                  height="105"
                  className="absolute top-0 left-0 z-20 w-[100px] h-[67px] lg:w-[120px] lg:h-[80px]"
                />
                <article className="relative z-20 flex flex-col h-full px-2 pt-10 pb-5 overflow-hidden text-center transition-all cursor-pointer rounded-xl group-hover:bg-blue-500">
                  <div className="relative mx-auto whitespace-nowrap">
                    <h3 className="inline-block mb-0 text-3xl relative mr-2 -top-4 text-slate-200 -rotate-[15deg] after:absolute after:h-[3px] after:left-0 after:w-full after:bg-red-700 after:z-10 after:top-1/2 after:-mt-[2px]">
                      40
                    </h3>
                    <h2 className="inline-block mb-1 text-6xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-500">
                      155
                    </h2>
                  </div>
                  <span className="text-xl tracking-widest text-white uppercase">
                    entries
                  </span>
                  <button className="relative flex items-center justify-center px-6 py-3 my-4 text-sm tracking-widest text-white uppercase transition-all bg-blue-500 rounded-full group-hover:bg-blue-300">
                    <span className="icon-ico-eth inline-block text-xl mr-0.5"></span>
                    <span className="text-base font-bold">
                      <img
                        src="https://metawin.com/_nuxt/ico-eth-opacity-blue2.469ecc1a.svg"
                        alt="Currency icon"
                        width="10"
                        className="w-auto inline-block relative h-4 mr-0.5"
                      />
                      4999
                    </span>
                  </button>
                  <div>
                    <span className="block text-sm font-bold leading-tight tracking-wider text-transparent uppercase transition-all bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-500">
                      Includes 115 free entries
                    </span>
                  </div>
                  <div>
                    <span className="block mt-1 text-xs text-white">
                      Gas Saving = 155x
                    </span>
                  </div>
                </article>
                <img
                  src="https://metawin.com/_nuxt/microchip.585024a7.png"
                  alt=""
                  width="480"
                  height="280"
                  className="absolute top-0 left-0 z-10 object-cover w-full h-full"
                  data-xblocker="passed"
                  style={{ visibility: "visible" }}
                />
              </div> */}
            </div>
            <div className="w-full">
              <p className="mt-4 text-sm text-center text-gray-500">
                All entries require gas.
              </p>
              <p className="mt-4 text-sm text-center text-gray-500">
                Smart Contract v1.2 Update:
                <br />
                <span className="text-white">
                  Multi Buy Gas Amount = Single Entry Gas Amount
                </span>
              </p>
            </div>
            {account === filterDataByID[0]?.creator &&
              filterDataByID[0]?.status !== 1 && (
                <div className="flex items-center justify-center w-full mt-10">
                  <button
                    className="px-10 py-3 font-bold transition-all duration-300 bg-white rounded-full cursor-pointer hover:bg-gray-500"
                    onClick={() => handleAcceptRaffleFunc()}
                  >
                    Accept this raffle
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
      {loadingState && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <PulseLoader color="white" />
        </div>
      )}
    </div>
  );
}
