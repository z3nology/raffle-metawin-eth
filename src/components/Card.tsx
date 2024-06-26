/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useContext, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Countdown from "../components/Countdown";
import { CardProps } from "../types";
import { errorAlert, successAlert } from "./toastGroup";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { RAFFLECONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { RaffleDataContext } from "../context/RaffleDataProvider";
import { PulseLoader } from "react-spinners";

export default function Card({
  raffleId,
  amountRaised,
  cancellingDate,
  collateralAddress,
  collateralId,
  collectionWhitelist,
  creator,
  winner,
  endTime,
  entriesLength,
  maxEntries,
  randomNumber,
  status,
  type,
}: CardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [joinCounts, setJoinCounts] = useState<Number>(0);
  const { collectionName, getRaffleData } = useContext(RaffleDataContext);

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

  // Get raffle contract
  const provider2 = new ethers.providers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/fe5e2547673f42af99e7bd9dc2d8de1e"
  );

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

  const RAFFLECONTRACT = new ethers.Contract(
    RAFFLECONTRACT_ADDR,
    RaffleCOTRACTABI,
    provider2
  );

  const RAFFLECONTRACT2 = new ethers.Contract(
    RAFFLECONTRACT_ADDR,
    RaffleCOTRACTABI,
    Signer
  );

  const handleClickBuyEntry = async () => {
    router.push(`/buyentry/${raffleId}`);

    // if (!account) {
    //   errorAlert("Please connect wallet first.");
    // } else {
    // }
  };

  const getEntriesByRaffleId = useCallback(async () => {
    try {
      const data = await RAFFLECONTRACT.getEntriesBought(raffleId);
      const joinData: { id: number; address: string }[] = [];

      for (let i = 0; i < data.length; i++) {
        if (
          joinData.filter((items) => items.address === data[i]?.player)
            .length === 0
        ) {
          joinData.push({
            id: i,
            address: data[i].player,
          });
        }
      }
      setJoinCounts(joinData.length);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line
  }, [raffleId]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        await getEntriesByRaffleId();
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [getEntriesByRaffleId]);

  const acceptRaffle = async () => {
    setLoadingState(true);
    await RAFFLECONTRACT2.AcceptRaffle(raffleId)
      .then((tx: any) => {
        tx.wait()
          .then(() => {
            successAlert("Accepted this Raffle");
            getRaffleData();
            setLoadingState(false);
          })
          .catch(() => {
            errorAlert("Accept Failed");
            getRaffleData();
            setLoadingState(false);
          });
      })
      .catch(() => {
        getRaffleData();
        errorAlert("Accept Failed");
        setLoadingState(false);
      });
  };

  return (
    <>
      <div className="rounded-xl relative bg-white hover:scale-[1.03] duration-300 transition-all z-10">
        <div
          className="relative z-0 w-full overflow-hidden cursor-pointer group"
          onClick={() => {
            handleClickBuyEntry();
            localStorage.setItem("raffleId", raffleId.toString());
          }}
        >
          <div className="w-full">
            <Slider {...settings} className="rounded-lg" cssEase="ease-in-out">
              {collateralId.map((data, index) => (
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

          <div className="absolute right-0 px-2 mx-2 text-sm font-bold text-black uppercase bg-yellow-300 rounded-full bottom-1">
            <Countdown
              endDateTime={endTime}
              raffleId={raffleId}
              winner={winner}
            />
          </div>
          <div className="absolute bottom-0 z-20 hidden w-full py-1 text-center text-white transition-all delay-100 translate-y-10 rounded-b-lg lg:block bg-slate-800 group-hover:translate-y-0">
            <span className="text-xs font-bold tracking-wider uppercase lg:text-sm">
              More info
            </span>
          </div>
        </div>
        <div className="z-30">
          <p className="relative z-30 font-bold text-center text-gray-500 text-md"></p>
          <h1 className="relative z-30 text-lg font-normal text-center text-gray-700">
            {collectionName} #{collateralId.join(",")}
          </h1>

          {status === 0 && Number(endTime) > Math.floor(Date.now() / 1000) && (
            <>
              <div className="z-30 w-full px-3">
                <button
                  className="w-full rounded-full bg-blue-500 text-white uppercase text-[15px] text-center font-bold py-2"
                  onClick={() => acceptRaffle()}
                >
                  Accept the raffle
                </button>
              </div>
            </>
          )}
          <p className="text-gray-400 text-[11px] font-bold text-center uppercase py-3 z-30">
            JOIN {joinCounts} METAWINNERS
          </p>
        </div>
      </div>
      {loadingState && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <PulseLoader color="white" />
        </div>
      )}
    </>
  );
}
