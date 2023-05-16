import { useEffect, useState, useContext } from "react";
import { default as ReactCountdown } from "react-countdown";
import { ethers } from "ethers";
import { RaffleDataContext } from "../context/RaffleDataProvider";
import { CONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { errorAlert, successAlert } from "./toastGroup";

const Countdown = ({ endDateTime, raffleId, winner }) => {
  const [endTimeState, setEndTimeState] = useState(false);
  const { createdRaffleData, getRaffleData } = useContext(RaffleDataContext);

  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();

  const NFTMintContract = new ethers.Contract(
    CONTRACT_ADDR,
    RaffleCOTRACTABI,
    Signer
  );

  const setWinnerFunc = async () => {
    setEndTimeState(true);
    if (winner === "0x0000000000000000000000000000000000000000")
      await NFTCONTRACT.setWinnerRaffle(raffleId)
        .then((tx) => {
          tx.wait()
            .then(() => {
              successAlert("Winner Choosed");
            })
            .catch(() => {
              errorAlert("Failed!");
            });
        })
        .catch(() => {
          errorAlert("Failed!");
        });
  };

  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <>
        {!endTimeState ? (
          <div className="text-sm font-extrabold text-black">
            <span>{days} D</span> :<span>{hours} H</span> :
            <span>{minutes} M</span> :<span>{seconds} S</span>
          </div>
        ) : (
          <div className="text-sm font-extrabold text-red-500">
            <span>ENDED</span>
          </div>
        )}
      </>
    );
  };

  return (
    <ReactCountdown
      date={endDateTime * 1000}
      renderer={renderer}
      onComplete={() => setWinnerFunc()}
    />
  );
};

export default Countdown;
