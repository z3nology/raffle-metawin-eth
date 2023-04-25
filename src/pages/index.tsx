/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import BlueChipsData from "../components/BlueChipsData";
import UpNextData from "../components/UpNextData";
import WinBoxData from "../components/WinBoxData";
import Head2HeadsData from "../components/Head2HeadsData";

const Home: NextPage = () => {
  const { account } = useWeb3React();
  return (
    <main className="px-10">
      <BlueChipsData />
      <UpNextData />
      <WinBoxData />
      <Head2HeadsData />
    </main>
  );
};

export default Home;
