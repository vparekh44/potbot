import { Contract, ethers } from "ethers";
import { Chain, chain } from "wagmi";
import { CHAIN_INFO, ContractName, ContractAbi } from "../config/chain";

// TODO: check this with Sahil
export const decodeSignatureGroupProperties = (
  data: string
): ethers.utils.Result => {
  return ethers.utils.defaultAbiCoder.decode(
    ["tuple(uint128,uint32,bytes)"],
    data
  );
};

export async function getNextNonce(
  provider: any,
  signer: any
): Promise<number> {
  const baseNonce = await provider.getTransactionCount(
    await signer.getAddress()
  );
  let nonceOffset = 0;
  return baseNonce + nonceOffset++;
}

type ContractConfig = ConstructorParameters<typeof ethers.Contract>;
export function contract(config: ContractConfig): Contract {
  return new ethers.Contract(...config);
}

export const getContractAbi = (contractName: ContractName) => {
  return JSON.parse(ContractAbi[contractName]);
};

export const getContractConfig = (
  contractName: ContractName,
  chainId: number,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
): ContractConfig => {
  return [
    CHAIN_INFO[chainId].contracts[contractName]!.address,
    getContractAbi(contractName),
    signerOrProvider,
  ];
};

export const getCorrectChainId = (): number => {
  return process.env.NEXT_PUBLIC_BADGES_MAINNET_MODE === "true"
    ? chain.polygon.id
    : chain.goerli.id;
};

export const getCorrectChain = (): Chain => {
  return process.env.NEXT_PUBLIC_BADGES_MAINNET_MODE === "true"
    ? chain.polygon
    : chain.goerli;
};

export const getTxUrl = (txHash: string) => {
  return CHAIN_INFO[getCorrectChainId()].txUrl + txHash;
};
