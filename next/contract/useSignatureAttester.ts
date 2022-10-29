import { BigNumberish, ethers } from "ethers";
import { useCallback } from "react";
import { useContract, useProvider, useSigner } from "wagmi";
import { CHAIN_INFO, ContractName } from "../config/chain";
import { getCorrectChainId, getContractAbi } from "../utils/attester";

export default function useSignatureAttester(
  chainId: number = getCorrectChainId()
) {
  const provider = useProvider({ chainId });
  const { data: signer } = useSigner();
  const address =
    CHAIN_INFO[chainId].contracts[ContractName.SignatureAttester]?.address;

  const contractWrite = useContract({
    address: address || ethers.constants.AddressZero,
    abi: getContractAbi(ContractName.SignatureAttester),
    signerOrProvider: signer,
  });

  const contractRead = useContract({
    address: address || ethers.constants.AddressZero,
    abi: getContractAbi(ContractName.SignatureAttester),
    signerOrProvider: provider,
  });

  const getSignatureAttesterCollectionId = useCallback(
    async (badgeId: BigNumberish) => {
      if (!contractRead) return null;
      // eslint-disable-next-line new-cap
      const cIdFirst = await contractRead.AUTHORIZED_COLLECTION_ID_FIRST();
      return cIdFirst.add(badgeId);
    },
    [contractRead]
  );

  const getSignatureAttesterCollectionIdFirst = useCallback(async () => {
    if (!contractRead) return null;
    // eslint-disable-next-line new-cap
    const cIdFirst = await contractRead.AUTHORIZED_COLLECTION_ID_FIRST();
    return cIdFirst;
  }, [contractRead]);

  return {
    contractRead,
    contractWrite,
    getSignatureAttesterCollectionId,
    getSignatureAttesterCollectionIdFirst,
  };
}
