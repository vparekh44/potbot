import { useProvider, useSigner, useContract } from "@web3modal/react";
import { Contract, ethers } from "ethers";
import { Chain, chain } from "wagmi";
import { CHAIN_INFO, ContractName, ContractAbi } from "../config/chain";

export const decodeSignatureGroupProperties = (
  data: string
): ethers.utils.Result => {
  return ethers.utils.defaultAbiCoder.decode(
    ["tuple(uint128,uint32,string,string,bytes)"],
    data
  );
};

export default function useAttestationRegistry(
  chainId: number = getCorrectChainId()
) {
  const provider = useProvider({ chainId });
  const { data: signer } = useSigner();
  const address =
    CHAIN_INFO[chainId].contracts[ContractName.AttestationRegistry]?.address;

  const contractWrite = useContract({
    addressOrName: address || ethers.constants.AddressZero,
    contractInterface: getContractAbi(ContractName.AttestationRegistry),
    signerOrProvider: signer,
  });

  const contractRead = useContract({
    addressOrName: address || ethers.constants.AddressZero,
    contractInterface: getContractAbi(ContractName.AttestationRegistry),
    signerOrProvider: provider,
  });

  return {
    contractRead,
    contractWrite,
  };
}

export async function getNextNonce(provider, signer): Promise<number> {
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
