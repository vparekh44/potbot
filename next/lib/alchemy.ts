// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "kWTKRAEgexFRuMx9tUZGjxEjssDbhgw8",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

export default alchemy;
