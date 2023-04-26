/* eslint-disable @next/next/no-img-element */

export default function NftCard(props: { tokenId: string; imgUrl: string }) {
  return (
    <>
      <div className="rounded-lg hover:scale-[1.02] transition-all duration-300 cursor-auto relative group ">
        <img
          alt=""
          src={props.imgUrl}
          className="object-cover w-full h-full rounded-lg"
        />
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-black opacity-0 hover:duration-300 hover:transition-all bg-opacity-80 group-hover:opacity-100">
          <h1 className="text-2xl text-white cursor-pointer">
            + create raffle
          </h1>
        </div>
        <div className="absolute font-bold text-gray-600 text-center top-2 left-2 z-[1] bg-white rounded-full min-w-[50px]">
          {props.tokenId}
        </div>
      </div>
    </>
  );
}
