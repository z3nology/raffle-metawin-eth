import { useContext } from "react";
import { ethers } from "ethers";
import Card from "./Card";
import { CONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { RaffleDataContext } from "../context/RaffleDataProvider";

export default function BlueChipsData() {
  const { account } = useWeb3React();

  const { createdRaffleData, raffleDataState } = useContext(RaffleDataContext);

  return (
    <div className="mt-24 min-h-[20vh] px-5">
      <h1 className="block mb-2 text-lg font-bold leading-none tracking-wider text-white uppercase lg:text-2xl category-title">
        blue chips
      </h1>
      {!account && (
        <div className="flex items-center justify-center w-full mt-10">
          <h1 className="text-xl font-bold text-white">
            Please connect wallet
          </h1>
        </div>
      )}
      <div className="grid w-full grid-cols-1 gap-2 py-5 lg:gap-5 xl:grid-cols-4 2xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
        {createdRaffleData?.map((data, index) => (
          <Card
            key={index}
            raffleId={index}
            name={data.name}
            amountRaised={data.amountRaised} // Convert to string before passing to Card
            cancellingDate={data.cancellingDate} // Convert to string before passing to Card
            collateralAddress={data.collateralAddress}
            collateralId={data.collateralId}
            collectionWhitelist={data.collectionWhitelist}
            creator={data.creator}
            winner={data.winner}
            endTime={Number(data.endTime)}
            entriesLength={Number(data.entriesLength)}
            maxEntries={Number(data.maxEntries)}
            randomNumber={Number(data.randomNumber)}
            status={Number(data.status)}
            type={data.type}
          />
        ))}
      </div>
      {raffleDataState && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <PulseLoader color="white" />
        </div>
      )}
    </div>
  );
}
