/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CompetitionModal from "./CompetitionModal";
import Link from "next/link";
import Countdown from "../components/Countdown";
import { CardProps, WindowWithEthereum } from "../types";
import { useWeb3React } from "@web3-react/core";
import { error } from "console";
import { errorAlert } from "./toastGroup";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { RAFFLECONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { RaffleDataContext } from "../context/RaffleDataProvider";

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
  const currentTime = new Date();
  const currentTimeStamp = Math.floor(currentTime.getTime() / 1000);
  console.log(currentTimeStamp);
  console.log("endtime", endTime);

  console.log("currentTime", currentTime);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinCounts, setJoinCounts] = useState<Number>(0);
  const { account } = useWeb3React();
  const { collectionName } = useContext(RaffleDataContext);

  function openModal() {
    setIsModalOpen(true);
  }

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

  const RAFFLECONTRACT = new ethers.Contract(
    RAFFLECONTRACT_ADDR,
    RaffleCOTRACTABI,
    provider2
  );

  const handleClickBuyEntry = async () => {
    router.push(`/buyentry/${raffleId}`);

    // if (!account) {
    //   errorAlert("Please connect wallet first.");
    // } else {
    // }
  };

  const getEntriesByRaffleId = async () => {
    const data = await RAFFLECONTRACT.getEntriesBought(raffleId);
    let joinData: any[] = [];
    for (let i = 0; i < data.length; i++) {
      if (
        joinData.filter((items) => items.address === data[i]?.player).length ===
        0
      ) {
        joinData.push({
          id: i,
          address: data[i].player,
        });
      }
    }
    setJoinCounts(Number(joinData.length));
  };

  useEffect(() => {
    getEntriesByRaffleId();
    // eslint-disable-next-line
  }, [raffleId]);

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

          {account === creator && endTime > Number(currentTime) && (
            <div className="z-30 w-full px-3">
              <button className="w-full rounded-full bg-blue-500 text-white uppercase text-[15px] text-center font-bold py-2 ">
                Accept the raffle
              </button>
            </div>
          )}
          <p className="text-gray-400 text-[11px] font-bold text-center uppercase py-3 z-30">
            JOIN {joinCounts} METAWINNERS
          </p>
        </div>
      </div>
      <CompetitionModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        raffleId={raffleId}
        amountRaised={amountRaised}
        cancellingDate={cancellingDate}
        collateralAddress={collateralAddress}
        collateralId={collateralId}
        collectionWhitelist={collectionWhitelist}
        creator={creator}
        endTime={endTime}
        entriesLength={entriesLength}
        maxEntries={maxEntries}
        randomNumber={randomNumber}
        status={status}
        type={type}
      />
    </>
  );
}
