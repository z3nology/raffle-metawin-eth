/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import CompetitionModal from "./CompetitionModal";
import Link from "next/link";

type CardProps = {
  fileSrc: string;
  type: string;
  name: string;
  price: string;
  entries: string;
};
export default function Card({
  fileSrc,
  type,
  name,
  price,
  entries,
}: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="rounded-xl relative bg-white hover:scale-[1.03] duration-300 transition-all z-10">
        <Link href={`/competition`} passHref>
          <div className="relative z-0 w-full overflow-hidden cursor-pointer group">
            {type === "image" ? (
              <img src={fileSrc} className="w-full h-full rounded-xl" alt="" />
            ) : (
              <video
                className="relative z-10 object-cover w-full h-full transition-all rounded-xl"
                title="Image of KILLABEARS"
                playsInline
                loop
                disableRemotePlayback
                draggable={false}
                preload="metadata"
                autoPlay
                muted
              >
                <source src={fileSrc} type="video/mp4" />
              </video>
            )}
            <div className="absolute px-2 text-sm font-bold text-gray-500 bg-white rounded-full bottom-1 left-1">
              #5304
            </div>
            <div className="absolute px-2 text-sm font-bold text-black uppercase bg-yellow-300 rounded-full bottom-1 right-1">
              3 Day Left
            </div>
            <div className="absolute bottom-0 z-20 hidden w-full py-1 text-center text-white transition-all delay-100 translate-y-10 rounded-b-lg lg:block bg-slate-800 group-hover:translate-y-0">
              <span className="text-xs font-bold tracking-wider uppercase lg:text-sm">
                More info
              </span>
            </div>
          </div>
        </Link>
        <div className="z-30">
          <p className="relative z-30 pt-2 font-bold text-center text-gray-500 text-md">
            {name}
          </p>
          <h1 className="relative z-30 py-1 text-2xl font-bold text-center text-black">
            ${price}
          </h1>
          <div className="z-30 w-full px-3">
            <button
              className="w-full rounded-full bg-blue-500 text-white uppercase text-[15px] text-center font-bold py-2 "
              onClick={() => openModal()}
            >
              enter now
            </button>
          </div>
          <p className="text-gray-400 text-[11px] font-bold text-center uppercase py-3 z-30">
            {entries}
          </p>
        </div>
      </div>
      <CompetitionModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
}
