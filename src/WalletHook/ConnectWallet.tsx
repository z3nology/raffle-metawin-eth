import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [11155111],
});

const switchNetworkRequest = () =>
  (window as any).ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0xaa36a7" }],
  });

const addNetworkRequest = () =>
  (window as any).ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0xaa36a7",
        chainName: "Sepolia",
        rpcUrls: ["https://endpoints.omniatech.io/v1/eth/sepolia/public"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
      },
    ],
  });

export const switchNetwork = async () => {
  if (window as any) {
    try {
      await switchNetworkRequest();
    } catch (error) {
      if ((error as any).code === 4902) {
        try {
          await addNetworkRequest();
          await switchNetworkRequest();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};
