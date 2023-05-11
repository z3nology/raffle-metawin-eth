/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import BlueChipsData from "../components/BlueChipsData";
import { ethers } from "ethers";
import { CONTRACT_ADDR } from "../config";

const Home: NextPage = () => {
  return (
    <main className="px-2 lg:px-10">
      <BlueChipsData />
      {/* <UpNextData />
      <WinBoxData />
      <Head2HeadsData /> */}
    </main>
  );
};

export default Home;
