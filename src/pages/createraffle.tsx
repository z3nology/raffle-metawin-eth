import { useAccount } from "wagmi";
import NftCard from "../components/NftCard";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateRaffleModal from "../components/CreateRaffleModal";
import { PulseLoader } from "react-spinners";
import { errorAlert } from "../components/toastGroup";
import { CollateralIDArrayType, NftDataType } from "../types";

const API_KEY =
  "tHPhVlJYUBEVY9I94rh0uMX4BBpUSgc3mMJfpjRCdQI6A6yPLdsiyPvAk2f41VKb";
const CHAIN = "sepolia";
const FORMAT = "decimal";
const LIMIT = "100";
const NORMALIZE_METADATA = "false";

export default function CreateRaffle() {
  const { address } = useAccount();
  const [nftData, setNftData] = useState<NftDataType[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [collateralIDArray, setCollateralIDArray] = useState<
    CollateralIDArrayType[]
  >([]);
  const [collectionAddrArray, setCollectionAddrArray] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNFTsForRaffle = (nftId: number, collectionAddr: string) => {
    const existingIndex = collateralIDArray.findIndex(
      (data) => data.nftId === nftId
    );
    if (existingIndex !== -1) {
      const newArray = [...collateralIDArray];
      newArray.splice(existingIndex, 1);
      setCollateralIDArray(newArray);
    } else {
      setCollateralIDArray([
        ...collateralIDArray,
        { nftId: nftId, collectionAddr: collectionAddr },
      ]);
    }
  };

  const handleOpenModal = () => {
    if (collateralIDArray.length === 0) {
      errorAlert("Please choose the NFTs to create raffle!");
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const getNfts = async () => {
      setLoadingState(true);

      const options = {
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
        params: {
          chain: CHAIN,
          format: FORMAT,
          limit: LIMIT,
          normalizeMetadata: NORMALIZE_METADATA,
        },
        headers: {
          accept: "application/json",
          "X-API-Key": API_KEY,
        },
      };

      try {
        const [response] = await Promise.all([axios.request(options)]);
        const { result } = response.data;

        const combinedResults = result.map((nft: any) => ({
          ...nft,
          type: CHAIN,
        }));

        const metadataResults = combinedResults.filter((n: any) => n.metadata);
        const tokens = metadataResults.map((data: any) => {
          let image = JSON.parse(data.metadata ?? "").image ?? "";

          if (image.startsWith("ipfs://")) {
            const pp = image.split("/");
            const cid = pp.slice(2, 3)[0];
            const filename = pp.slice(3).join("/");
            const hostname = "https://ipfs.io/ipfs/";
            image = hostname + cid + (filename ? "/" + filename : "");
          }

          return {
            mintId: data.token_id,
            title: data.name,
            image: image,
            listedForSale: false,
            collectionId: data.token_address,
            type: data.type,
          };
        });

        setNftData(tokens);
        setLoadingState(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (address) {
      getNfts();
    }
  }, [address]);

  return (
    <div className="w-full px-2 mt-24 mb-10 md:px-10">
      <h1 className="text-2xl font-normal text-white uppercase">
        my nft lists
      </h1>
      {loadingState && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <PulseLoader color="white" />
        </div>
      )}
      {!loadingState && (
        <>
          <div className="w-full min-h-[30vh] flex items-center justify-center flex-col">
            {nftData.length === 0 && (
              <div className="flex items-center justify-center w-full">
                <h1 className="text-2xl font-normal text-center text-white uppercase">
                  Nothing to show
                </h1>
              </div>
            )}
            <div className="grid w-full grid-cols-2 gap-4 px-3 py-5 md:px-10 lg:gap-5 xl:grid-cols-6 2xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4">
              {nftData?.map((data, index) => (
                <NftCard
                  name={data.title}
                  key={index}
                  tokenId={data.mintId}
                  imgUrl={data.image}
                  collectionAddr={data.collectionId}
                  collateralIDArray={collateralIDArray}
                  onAddNFTsForRaffle={() =>
                    handleAddNFTsForRaffle(
                      Number(data.mintId),
                      data.collectionId
                    )
                  }
                />
              ))}
            </div>
          </div>
          <div className="fixed left-0 right-0 flex items-center justify-center bottom-10 z-[41]">
            <button
              className="text-sm py-3 px-6 bg-slate-800 border-2 border-cyan-500 text-white rounded-full tracking-widest uppercase hover:bg-slate-900 hover:border-cyan-200 transition-all focus:bg-slate-800 focus:border-cyan-200 relative shadow-[0_0_2px_0] shadow-cyan-500 disabled:bg-slate-800 disabled:hover:bg-slate-800"
              onClick={() => handleOpenModal()}
            >
              <span className="transition-all">
                <span className="pr-3">{`+ Create Raffle`}</span>
              </span>
            </button>
          </div>
        </>
      )}
      <CreateRaffleModal
        isOpen={isModalOpen}
        collateralIDArray={collateralIDArray}
        collectionAddrArray={collectionAddrArray}
        closeModal={() => setIsModalOpen(false)}
        startLoading={() => setLoadingState(true)}
        endLoading={() => setLoadingState(false)}
      />
    </div>
  );
}
