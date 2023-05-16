/* eslint-disable @next/next/no-img-element */
import { BsFillCheckCircleFill } from "react-icons/bs";

export default function NftCard(props: {
  name: string;
  tokenId: string;
  imgUrl: string;
  collateralIDArray: number[];
  onAddNFTsForRaffle: () => void;
}) {
  return (
    <>
      <div
        className="rounded-lg hover:scale-[1.02] transition-all duration-300 relative group cursor-pointer bg-white h-full"
        onClick={() => props.onAddNFTsForRaffle()}
      >
        <img
          alt=""
          src={props.imgUrl}
          className="relative object-cover w-full rounded-lg"
        />
        {props.collateralIDArray.filter(
          (data) => data === Number(props.tokenId)
        ).length !== 0 && (
          <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black rounded-lg bg-opacity-60 backdrop-blur-md">
            <BsFillCheckCircleFill color="white" size={50} />
          </div>
        )}
        <h1 className="font-bold text-gray-600 text-center z-[1] relative py-2 text-md">
          {props.name} {" #"}
          {props.tokenId}
        </h1>
      </div>
    </>
  );
}
