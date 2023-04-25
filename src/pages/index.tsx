/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";

const Home: NextPage = () => {
  const { account } = useWeb3React();
  return <></>;
};

export default Home;
