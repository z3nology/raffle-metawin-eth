import { useEffect, useState, useContext } from "react";
import { default as ReactCountdown } from "react-countdown";
import { ethers } from "ethers";
import { RaffleDataContext } from "../context/RaffleDataProvider";
import { RAFFLECONTRACT_ADDR } from "../config";
import RaffleCOTRACTABI from "../../public/abi/raffleContract_abi.json";
import { errorAlert, successAlert } from "./toastGroup";
import { useWeb3React } from "@web3-react/core";

const Countdown = ({ endDateTime, raffleId, winner }) => {
  const { account } = useWeb3React();
  const [endTimeState, setEndTimeState] = useState(false);

  let Signer;

  if (window.ethereum) {
    const Provider = new ethers.providers.Web3Provider(window.ethereum);
    Signer = Provider.getSigner();
  }

  const RAFFLECONTRACT = new ethers.Contract(
    RAFFLECONTRACT_ADDR,
    RaffleCOTRACTABI,
    Signer
  );

  const setWinnerFunc = async () => {
    setEndTimeState(true);
    // if (winner === "0x0000000000000000000000000000000000000000" && account)
    //   await RAFFLECONTRACT.setWinnerRaffle(raffleId)
    //     .then((tx) => {
    //       tx.wait()
    //         .then(() => {
    //           successAlert("Winner Choosed");
    //         })
    //         .catch(() => {
    //           errorAlert("Failed!");
    //         });
    //     })
    //     .catch(() => {
    //       errorAlert("Failed!");
    //     });
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
            <span>ended raffles</span>
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
