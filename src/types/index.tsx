export type CardProps = {
  raffleId: number;
  name: string;
  amountRaised: Number;
  cancellingDate: Number;
  collateralAddress: String[];
  collateralId: String[];
  collectionWhitelist: String[];
  creator: String;
  winner: String;
  endTime: Number;
  entriesLength: Number;
  maxEntries: number;
  randomNumber: Number;
  status: Number;
  type: string;
};

export type RaffleDataContextValue = {
  createdRaffleData: CardProps[];
  raffleDataState: Boolean;
  collectionName: String;
  getRaffleData: () => void;
};

export interface WindowWithEthereum extends Window {
  ethereum?: any;
}

export type PriceDataType = {
  id: number;
  numEntries: number;
  price: number;
};

export type EntriesHistory = {
  address: string;
  entriesCounts: number;
};
