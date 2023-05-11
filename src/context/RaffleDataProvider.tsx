import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { CardProps, RaffleDataContextValue } from "../types";
import { ethers } from "ethers";
import { CONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";

export const RaffleDataContext = createContext<RaffleDataContextValue>({
  createdRaffleData: [],
  raffleDataState: false,
});

const GetActivityDataProvider: React.FC = ({ children }) => {
  const { account } = useWeb3React();
  const [raffleDataState, setRaffleDataState] = useState(false);
  const [createdRaffleData, setCreatedRaffleData] = useState<CardProps[]>([]);
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

  const NFTCONTRACT = new ethers.Contract(
    CONTRACT_ADDR,
    RaffleCOTRACTABI,
    Signer
  );

  const getRaffleData = async () => {
    setRaffleDataState(true);
    const raffleDataLength = await NFTCONTRACT.getRafflesLength();
    const raffleData: CardProps[] = [];
    for (let i = 0; i < Number(raffleDataLength); i++) {
      const data = await NFTCONTRACT.getRaffleData(i);
      raffleData.push({
        raffleId: i,
        amountRaised: Number(
          parseFloat(
            ethers.utils.formatEther(data.amountRaised.toString())
          ).toFixed(8)
        ),
        cancellingDate: Number(data.cancellingDate),
        collateralAddress: data.collateralAddress,
        collateralId: data.collateralId.map((id: number) => Number(id)),
        collectionWhitelist: data.collectionWhitelist,
        creator: data.creator,
        endTime: Number(data.endTime),
        entriesLength: Number(data.entriesLength),
        maxEntries: Number(data.maxEntries),
        randomNumber: Number(data.randomNumber),
        status: Number(data.status),
        type: "image",
      });
    }
    console.log("raffleData", raffleData);
    setCreatedRaffleData(raffleData);
    setRaffleDataState(false);
  };

  useEffect(() => {
    if (account) getRaffleData();
    // eslint-disable-next-line
  }, [account]);

  return (
    <RaffleDataContext.Provider
      value={{
        createdRaffleData,
        raffleDataState,
      }}
    >
      {children}
    </RaffleDataContext.Provider>
  );
};

export default GetActivityDataProvider;
