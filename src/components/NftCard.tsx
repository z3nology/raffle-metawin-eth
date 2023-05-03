/* eslint-disable @next/next/no-img-element */
import { BsFillCheckCircleFill } from "react-icons/bs";

export default function NftCard(props: {
  tokenId: string;
  imgUrl: string;
  collateralIDArray: number[];
  onAddNFTsForRaffle: () => void;
}) {
  return (
    <>
      <div
        className="rounded-lg hover:scale-[1.02] transition-all duration-300 relative group cursor-pointer"
        onClick={() => props.onAddNFTsForRaffle()}
      >
        <img
          alt=""
          src={props.imgUrl}
          className="object-cover w-full h-full rounded-lg"
        />
        <div className="absolute font-bold text-gray-600 text-center top-2 left-2 z-[1] bg-white rounded-full min-w-[50px]">
          {props.tokenId}
        </div>
        {props.collateralIDArray.filter(
          (data) => data === Number(props.tokenId)
        ).length !== 0 && (
          <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black rounded-lg bg-opacity-60 backdrop-blur-md">
            <BsFillCheckCircleFill color="white" size={30} />
          </div>
        )}
      </div>
    </>
  );
}
