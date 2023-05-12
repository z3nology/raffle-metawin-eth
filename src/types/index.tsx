export type CardProps = {
  raffleId: number;
  name: string;
  amountRaised: Number;
  cancellingDate: Number;
  collateralAddress: String[];
  collateralId: String[];
  collectionWhitelist: String[];
  creator: String;
  endTime: Number;
  entriesLength: Number;
  maxEntries: Number;
  randomNumber: Number;
  status: Number;
  type: string;
};

export type RaffleDataContextValue = {
  createdRaffleData: CardProps[];
  raffleDataState: Boolean;
};

export interface WindowWithEthereum extends Window {
  ethereum?: any;
}
