import { useWeb3React } from "@web3-react/core";
import NftCard from "../components/NftCard";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateRaffleModal from "../components/CreateRaffleModal";
import { PulseLoader } from "react-spinners";
import { errorAlert } from "../components/toastGroup";

type NftDataType = {
  mintId: string;
  title: string;
  image: string;
  listedForSale: boolean;
  collectionId: string;
  type: string;
};

export default function Competition() {
  const { account } = useWeb3React();

  const [nftData, setNftData] = useState<NftDataType[]>([]);
  const [loadingState, setLoadingState] = useState<Boolean>(false);
  const [collateralIDArray, setCollateralIDArray] = useState<number[]>([]);

  const getNfts = async (address: string) => {
    setLoadingState(true);
    const optionsGoerli = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: "sepolia",
        format: "decimal",
        limit: "100",
        normalizeMetadata: "false",
      },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "tHPhVlJYUBEVY9I94rh0uMX4BBpUSgc3mMJfpjRCdQI6A6yPLdsiyPvAk2f41VKb", //Private-key
      },
    };

    try {
      const [responseGoerli] = await Promise.all([
        axios.request(optionsGoerli),
      ]);
      console.log("responseGoerli.data.result=>", responseGoerli.data.result);
      const goerliNfts = responseGoerli.data.result.map((nft: any) => ({
        ...nft,
        type: "goerli",
      }));

      const combinedResults = [...goerliNfts];

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
      //   return metadataResults;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (account) {
      getNfts(account);
    }
    // eslint-disable-next-line
  }, [account]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (collateralIDArray.length === 0) {
      errorAlert("Please choose the NFTs to create raffle!");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleAddNFTsForRaffle = (nftId: number) => {
    if (collateralIDArray.includes(nftId)) {
      setCollateralIDArray(collateralIDArray.filter((id) => id !== nftId));
    } else {
      setCollateralIDArray([...collateralIDArray, nftId]);
    }
  };

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
            <div className="grid w-full grid-cols-2 gap-2 py-5 lg:gap-5 xl:grid-cols-7 2xl:grid-cols-3 lg:grid-cols-4 md:grid-cols-3">
              {nftData?.map((data, index) => (
                <NftCard
                  name={data.title}
                  key={index}
                  tokenId={data.mintId}
                  imgUrl={data.image}
                  collateralIDArray={collateralIDArray}
                  onAddNFTsForRaffle={() =>
                    handleAddNFTsForRaffle(Number(data.mintId))
                  }
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
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
        closeModal={() => setIsModalOpen(false)}
        startLoading={() => setLoadingState(true)}
        endLoading={() => setLoadingState(false)}
      />
    </div>
  );
}
