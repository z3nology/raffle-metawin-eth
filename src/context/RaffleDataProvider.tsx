import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { CardProps, RaffleDataContextValue } from "../types";
import { ethers } from "ethers";
import { RAFFLECONTRACT_ADDR, NFTCONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import NFTCONTRACT_ABI from "../../public/abi/nftContract_abi.json";
import { useRouter } from "next/router";

export const RaffleDataContext = createContext<RaffleDataContextValue>({
  createdRaffleData: [],
  raffleDataState: false,
  collectionName: "",
  getRaffleData: () => {},
});

const GetActivityDataProvider: React.FC = ({ children }) => {
  const { account } = useWeb3React();
  const router = useRouter();
  const [raffleDataState, setRaffleDataState] = useState(false);
  const [collectionName, setCollectionName] = useState("");
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

  const provider2 = new ethers.providers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/fe5e2547673f42af99e7bd9dc2d8de1e"
  );

  const NFTCONTRACT = new ethers.Contract(
    NFTCONTRACT_ADDR,
    NFTCONTRACT_ABI,
    provider2
  );

  const RAFFLECONTRACT2 = new ethers.Contract(
    RAFFLECONTRACT_ADDR,
    RaffleCOTRACTABI,
    provider2
  );

  console.log("contract => ", RAFFLECONTRACT2);

  const getRaffleData = async () => {
    setRaffleDataState(true);
    const raffleDataLength = await RAFFLECONTRACT2.getRafflesLength();
    const raffleData: CardProps[] = [];
    if (raffleDataLength)
      for (let i = 0; i < Number(raffleDataLength); i++) {
        const data = await RAFFLECONTRACT2.getRaffleData(i);
        raffleData.push({
          raffleId: i,
          amountRaised: Number(
            parseFloat(
              ethers.utils.formatEther(data.amountRaised.toString())
            ).toFixed(8)
          ),
          cancellingDate: Number(data.cancellingDate),
          name: data.name,
          collateralAddress: data.collateralAddress,
          collateralId: data.collateralId.map((id: number) => Number(id)),
          collectionWhitelist: data.collectionWhitelist,
          creator: data.creator,
          winner: data.winner,
          endTime: Number(data.endTime),
          entriesLength: Number(data.entriesLength),
          maxEntries: Number(data.maxEntries),
          randomNumber: Number(data.randomNumber),
          status: Number(data.status),
          type: "image",
        });
      }
    setCreatedRaffleData(raffleData);
    setRaffleDataState(false);
  };

  const getCollectionName = async () => {
    const name = await NFTCONTRACT.name();

    setCollectionName(name);
  };

  useEffect(() => {
    getRaffleData();
    getCollectionName();
    // eslint-disable-next-line
  }, []);

  return (
    <RaffleDataContext.Provider
      value={{
        createdRaffleData,
        raffleDataState,
        collectionName,
        getRaffleData,
      }}
    >
      {children}
    </RaffleDataContext.Provider>
  );
};

export default GetActivityDataProvider;
