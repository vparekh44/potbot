import { chain } from "wagmi";

// import AttestationRegistryAbi from "../contract/abi/pot/AttestationRegistry.json";
// import BadgesAbi from "../contract/abi/pot/Badges.json";
// import IdentityMerkleAttesterAbi from "../contract/abi/pot/IdentityMerkleAttester.json";
// import SkillAttesterAbi from "../contract/abi/pot/SkillAttester.json";
// import SkillBadgeAbi from "../contract/abi/pot/SkillBadge.json";
// import SignatureAttesterAbi from "../contract/abi/pot/SignatureAttester.json";

export enum ContractName {
  AttestationRegistry = "AttestationRegistry",
  Badges = "Badges",
  IdentityMerkleAttester = "IdentityMerkleAttester",
  SkillAttester = "SkillAttester",
  SkillBadge = "SkillBadge",
  SignatureAttester = "SignatureAttester",
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
export const CHAIN_INFO: ChainInfoMap = {
  [chain.rinkeby.id]: {
    gnosisTxServiceUrl: "https://safe-transaction.rinkeby.gnosis.io",
    rpcUrl: [
      `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      `https://eth-rinkeby.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_RINKEBY}`,
    ],
    alchemyNftApiUrl: `https://eth-rinkeby.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_RINKEBY}`,
    txUrl: `https://rinkeby.etherscan.io/tx/`,
    openseaUrl: `https://testnets.opensea.io/assets/rinkeby/`,
    raribleUrl: `https://testnet.rarible.com/token/rinkeby/`,
    nativeTokenSymbol: `ETH`,
    nativeTokenDecimals: 18,
    contracts: {},
  },
  [chain.goerli.id]: {
    gnosisTxServiceUrl: "https://safe-transaction.goerli.gnosis.io",
    rpcUrl: [
      `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      `https://eth-goerli.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_GOERLI}`,
    ],
    alchemyNftApiUrl: `https://eth-goerli.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_GOERLI}`,
    txUrl: `https://goerli.etherscan.io/tx/`,
    openseaUrl: `https://testnets.opensea.io/assets/goerli/`,
    raribleUrl: `https://testnet.rarible.com/token/goerli/`,
    nativeTokenSymbol: `ETH`,
    nativeTokenDecimals: 18,
    contracts: {
      [ContractName.AttestationRegistry]: {
        address: "0xe50CEebA7F0f796C65E92A3ea7A6d1B6e0b7A40E",
      },
      [ContractName.Badges]: {
        address: "0xFD75D91321816bd4772831621Af68089631eA459",
      },
      [ContractName.IdentityMerkleAttester]: {
        address: "0xc5E69b64CaaB96488D40274dFF83Ba53A58d3e30",
      },
      [ContractName.SkillAttester]: {
        address: "0xD94fF43dF23540e9e06F56F36e7fe54565aEB483",
      },
      [ContractName.SkillBadge]: {
        address: "0xCa66E3b10D5a207a221199b8bCfadab3212f878b",
      },
      [ContractName.SignatureAttester]: {
        address: "0xeE9Cc5630F1d1d17d2EA232ca12ff52c4a099920",
      },
    },
  },
  [chain.mainnet.id]: {
    gnosisTxServiceUrl: "https://safe-transaction.gnosis.io",
    rpcUrl: [
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_MAINNET}`,
    ],
    alchemyNftApiUrl: `https://eth-mainnet.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_MAINNET}`,
    txUrl: `https://etherscan.io/tx/`,
    openseaUrl: `https://opensea.io/assets/ethereum/`,
    raribleUrl: `https://rarible.com/token/`,
    nativeTokenSymbol: `ETH`,
    nativeTokenDecimals: 18,
    coingeckoChainName: `ethereum`,
    coingeckoNativeTokenId: "ethereum",
    contracts: {},
  },
  [chain.polygon.id]: {
    gnosisTxServiceUrl: "https://safe-transaction.polygon.gnosis.io",
    rpcUrl: [
      `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_POLY}`,
    ],
    alchemyNftApiUrl: `https://polygon-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_POLY}`,
    txUrl: `https://polygonscan.io/tx/`,
    openseaUrl: `https://opensea.io/assets/matic/`,
    raribleUrl: `https://rarible.com/token/polygon/`,
    nativeTokenSymbol: `MATIC`,
    nativeTokenDecimals: 18,
    coingeckoChainName: `polygon-pos`,
    coingeckoNativeTokenId: "matic-network",
    contracts: {
      [ContractName.AttestationRegistry]: {
        address: "0xC33926eeF7195cC1128f48E8E877694dFe3c2dC4",
      },
      [ContractName.Badges]: {
        address: "0x9C92849c0a882872b21a73693B2e37b463CEc201",
      },
      [ContractName.IdentityMerkleAttester]: {
        address: "0x22222C9042EC0c45EfE94d0A08B8DCeD57086211",
      },
      [ContractName.SkillAttester]: {
        address: "0xAD6176Fe096Af5A20A333E841c58fD593A8D3A9f",
      },
      [ContractName.SkillBadge]: {
        address: "0xB4ad4f74d65A64BD8886F9AeB6CB4d227fFBeD18",
      },
      [ContractName.SignatureAttester]: {
        address: "0x8f4c102875AFb6152004f8e87cF1cBF90431Df54",
      },
    },
  },
  [chain.optimism.id]: {
    gnosisTxServiceUrl: "https://safe-transaction.optimism.gnosis.io/",
    rpcUrl: [
      `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_OPT_MAINNET}`,
    ],
    alchemyNftApiUrl: `https://opt-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY_OPT_MAINNET}`,
    txUrl: `https://optimistic.etherscan.io/tx/`,
    openseaUrl: `https://opensea.io/assets/optimism/`,
    raribleUrl: `https://rarible.com/token/optimism/`,
    nativeTokenSymbol: `ETH`,
    nativeTokenDecimals: 18,
    coingeckoChainName: `optimistic-ethereum`,
    coingeckoNativeTokenId: "ethereum",
    contracts: {},
  },
};

export const ContractAbi: { [contractName in ContractName]: string } = {
  [ContractName.AttestationRegistry]: JSON.stringify(AttestationRegistryAbi),
  [ContractName.Badges]: JSON.stringify(BadgesAbi),
  [ContractName.IdentityMerkleAttester]: JSON.stringify(
    IdentityMerkleAttesterAbi
  ),
  [ContractName.SkillAttester]: JSON.stringify(SkillAttesterAbi),
  [ContractName.SkillBadge]: JSON.stringify(SkillBadgeAbi),
  [ContractName.SignatureAttester]: JSON.stringify(SignatureAttesterAbi),
};

export const ExternalContracts = {
  QuestbookCourseNFT: "0x33268c70A7C7149470fEA295f159F1c3189675D2",
  BuildspacePolygonV2Contract: "0x3CD266509D127d0Eac42f4474F57D0526804b44e",
  BuildspaceEthMainnetContract: "0x322A88a26C23D45c7887711caDF055275701738E",
};
