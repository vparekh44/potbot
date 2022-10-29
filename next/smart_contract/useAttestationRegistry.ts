import { ethers } from "ethers";
import { useContract, useProvider, useSigner } from "wagmi";
import { CHAIN_INFO, ContractName } from "../config/chain";
import { getCorrectChainId, getContractAbi } from "../utils/attester";

export default function useAttestationRegistry(
  chainId: number = getCorrectChainId()
) {
  const provider = useProvider({ chainId });
  const { data: signer } = useSigner();
  const address =
    CHAIN_INFO[chainId].contracts[ContractName.AttestationRegistry]?.address;

  const contractWrite = useContract({
    address: address || ethers.constants.AddressZero,
    abi: getContractAbi(ContractName.AttestationRegistry),
    signerOrProvider: signer,
  });

  const contractRead = useContract({
    address: address || ethers.constants.AddressZero,
    abi: getContractAbi(ContractName.AttestationRegistry),
    signerOrProvider: provider,
  });

  return {
    contractRead,
    contractWrite,
  };
}
