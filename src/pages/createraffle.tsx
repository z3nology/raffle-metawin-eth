import { useWeb3React } from "@web3-react/core";
import NftCard from "../components/NftCard";
import axios from "axios";
import { useEffect, useState } from "react";

type NftDataType = {
  mintId: string;
  title: string;
  image: string;
  listedForSale: boolean;
  collectionId: string;
  type: string;
};

export default function CreateRaffle() {
  const { account } = useWeb3React();

  const [nftData, setNftData] = useState<NftDataType[]>([]);

  const getNfts = async (address: string) => {
    const optionsGoerli = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: "goerli",
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
      //   const mumbaiNfts = (responseMumbai.data.result as TokenAPISimple[]).map(
      //     (nft) => ({ ...nft, type: "mumbai" })
      //   );
      //   const bscNfts = (responseBsc.data.result as TokenAPISimple[]).map(
      //     (nft) => ({ ...nft, type: "bsc" })
      //   );
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
          console.log(image, "=========");
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

      console.log("nftData------>", tokens);
      //   //@ts-ignore
      setNftData(tokens);
      //   return metadataResults;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (account) {
      getNfts(account);
    }
  }, [account]);

  return (
    <div className="w-full px-5 mt-20 ">
      <h1 className="text-2xl font-normal text-white uppercase">
        my nft lists
      </h1>
      <div className="grid w-full grid-cols-2 gap-2 py-5 lg:gap-5 xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-3">
        {nftData?.map((data, index) => (
          <NftCard key={index} tokenId={data.mintId} imgUrl={data.image} />
        ))}
      </div>
    </div>
  );
}
