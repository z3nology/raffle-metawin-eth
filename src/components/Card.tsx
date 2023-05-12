/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CompetitionModal from "./CompetitionModal";
import Link from "next/link";
import Countdown from "../components/Countdown";
import { CardProps } from "../types";

export default function Card({
  raffleId,
  amountRaised,
  cancellingDate,
  collateralAddress,
  collateralId,
  collectionWhitelist,
  creator,
  endTime,
  entriesLength,
  maxEntries,
  randomNumber,
  status,
  type,
}: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <div className="rounded-xl relative bg-white hover:scale-[1.03] duration-300 transition-all z-10">
        <Link href={`/buyentry/${raffleId}`} passHref>
          <div className="relative z-0 w-full overflow-hidden cursor-pointer group">
            <div className="w-full">
              <Slider
                {...settings}
                className="rounded-lg"
                cssEase="ease-in-out"
              >
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
              <Countdown endDateTime={endTime} />
            </div>
            <div className="absolute bottom-0 z-20 hidden w-full py-1 text-center text-white transition-all delay-100 translate-y-10 rounded-b-lg lg:block bg-slate-800 group-hover:translate-y-0">
              <span className="text-xs font-bold tracking-wider uppercase lg:text-sm">
                More info
              </span>
            </div>
          </div>
        </Link>
        <div className="z-30">
          <p className="relative z-30 font-bold text-center text-gray-500 text-md"></p>
          <h1 className="relative z-30 text-xl font-normal text-center text-black">
            #{collateralId.join(",")}
          </h1>

          <div className="z-30 w-full px-3">
            <Link href={`/buyentry/${raffleId}`} passHref>
              <button className="w-full rounded-full bg-blue-500 text-white uppercase text-[15px] text-center font-bold py-2 ">
                enter now
              </button>
            </Link>
          </div>
          <p className="text-gray-400 text-[11px] font-bold text-center uppercase py-3 z-30">
            Max Entries Per User: {maxEntries}
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
