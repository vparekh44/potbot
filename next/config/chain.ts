import { chain } from "wagmi";

import ReputationRegistryAbi from "../contract/abi/pot/ReputationRegistry.json";
import BadgesAbi from "../contract/abi/pot/Badges.json";
import IdentityAbi from "../contract/abi/pot/Identity.json";
import KarmaTokenManagerAbi from "../contract/abi/pot/KarmaTokenManager.json";
import KarmaTokenAbi from "../contract/abi/pot/KarmaToken.json";
import LensVerifierAbi from "../contract/abi/pot/LensVerifier.json";
import SignatureVerifierAbi from "../contract/abi/pot/SignatureVerifier.json";

export enum ContractName {
  Badges = "Badges",
  reputationRegistry = "reputationRegistry",
  identity = "identity",
  karmaTokenManager = "karmaTokenManager",
  karmaToken = "karmaToken",
  lensVerifier = "lensVerifier",
  signatureVerifier = "signatureVerifier",
}

interface ChainInfo {
  readonly gnosisTxServiceUrl: string;
  readonly rpcUrl: string[];
  readonly txUrl: string;
  readonly openseaUrl: string;
  readonly raribleUrl: string;
  readonly alchemyNftApiUrl: string;
  readonly nativeTokenSymbol: string;
  readonly nativeTokenDecimals: number;
  readonly coingeckoChainName?: string;
  readonly coingeckoNativeTokenId?: string;
  readonly contracts: {
    [contractName in ContractName]?: { address: string };
  };
}

export type ChainInfoMap = { readonly [chainId: number]: ChainInfo };

// TODO: fix mumbai stuff tomorrow
export const CHAIN_INFO: ChainInfoMap = {
  [chain.polygonMumbai.id]: {
    gnosisTxServiceUrl: "https://safe-transaction.rinkeby.gnosis.io",
    rpcUrl: [
      `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      `https://eth-rinkeby.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_RINKEBY}`,
    ],
    alchemyNftApiUrl: `https://eth-rinkeby.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_RINKEBY}`,
    txUrl: `https://mumbai.etherscan.io/tx/`,
    openseaUrl: `https://testnets.opensea.io/assets/mumbai/`,
    raribleUrl: `https://testnet.rarible.com/token/mumbai/`,
    nativeTokenSymbol: `MATIC`,
    nativeTokenDecimals: 18,
    contracts: {
      [ContractName.Badges]: {
        address: "0xcfdee74a633c7078970d31e2f305e9f9592c231f",
      },
      [ContractName.reputationRegistry]: {
        address: "0x528a14bc877da96e6bfac3ecd4f429e43b168a10",
      },
      [ContractName.identity]: {
        address: "0x515d42cc905af2cbaf1d7497a223326096719b62",
      },
      [ContractName.karmaTokenManager]: {
        address: "0x9e73f331dfd2a4bf15c28f4c6a70a6d9015df751",
      },
      [ContractName.karmaToken]: {
        address: "0x51afbcfdac8fbccdfa0d8fb60596e331f202d3ac",
      },
      [ContractName.lensVerifier]: {
        address: "0xbc3f9b4b0f479e90c02e9bab3288b0c3509f42af",
      },
      [ContractName.signatureVerifier]: {
        address: "0xb4e1f53c2f71d78da3a64194be3d28a904312978",
      },
    },
  },
};

export const ContractAbi: { [contractName in ContractName]: string } = {
  [ContractName.Badges]: JSON.stringify(BadgesAbi),
  [ContractName.identity]: JSON.stringify(IdentityAbi),
  [ContractName.reputationRegistry]: JSON.stringify(BadgesAbi),
  [ContractName.karmaTokenManager]: JSON.stringify(KarmaTokenManagerAbi),
  [ContractName.karmaToken]: JSON.stringify(KarmaTokenAbi),
  [ContractName.lensVerifier]: JSON.stringify(LensVerifierAbi),
  [ContractName.signatureVerifier]: JSON.stringify(SignatureVerifierAbi),
};

export const ExternalContracts = {
  QuestbookCourseNFT: "0x33268c70A7C7149470fEA295f159F1c3189675D2",
  BuildspacePolygonV2Contract: "0x3CD266509D127d0Eac42f4474F57D0526804b44e",
  BuildspaceEthMainnetContract: "0x322A88a26C23D45c7887711caDF055275701738E",
};
