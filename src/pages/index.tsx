import { useContext } from "react";
import Card from "../components/Card";
import { PulseLoader } from "react-spinners";
import { RaffleDataContext } from "../context/RaffleDataProvider";

export default function Home() {
  const { createdRaffleData, raffleDataState } = useContext(RaffleDataContext);
  const currentTime = new Date();
  const currentTimeStamp = Math.floor(currentTime.getTime() / 1000);

  return (
    <>
      <div className="mt-24 min-h-[20vh] px-5">
        <h1 className="block mb-2 text-lg font-bold leading-none tracking-wider text-white uppercase lg:text-2xl category-title">
          Live Raffles
        </h1>
        {createdRaffleData?.filter(
          (data) => Number(data.endTime) > currentTimeStamp
        ).length === 0 && (
          <div className="flex items-center justify-center w-full mt-10">
            <h1 className="text-xl text-gray-600">Nothing to show</h1>
          </div>
        )}
        <div className="grid w-full grid-cols-2 gap-2 py-5 lg:gap-5 xl:grid-cols-5 2xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-3">
          {createdRaffleData
            ?.filter((data) => Number(data.endTime) > currentTimeStamp)
            .map((data, index) => (
              <Card
                key={index}
                raffleId={data.raffleId}
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
        <h1 className="block mb-2 text-lg font-bold leading-none tracking-wider text-white uppercase lg:text-2xl category-title">
          Ended Raffles
        </h1>
        {createdRaffleData?.filter(
          (data) => Number(data.endTime) < currentTimeStamp
        ).length === 0 && (
          <div className="flex items-center justify-center w-full mt-10">
            <h1 className="text-xl text-gray-600">Nothing to show</h1>
          </div>
        )}
        <div className="grid w-full grid-cols-2 gap-2 py-5 lg:gap-5 xl:grid-cols-5 2xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-3">
          {createdRaffleData
            ?.filter((data) => Number(data.endTime) < currentTimeStamp)
            .map((data, index) => (
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
    </>
  );
}
