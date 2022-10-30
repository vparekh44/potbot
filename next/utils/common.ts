import { ethers, utils, Wallet } from "ethers";
import { RequestStruct } from "../contract/types";


export const generateEIP712TypedSignData = (
  request: any,
  verifyingContract: string,
  deadline: string | number,
  domainName: string
) => {
  return {
    primaryType: 'ReputationRequest',
    domain: {
      name: domainName,
      version: '1',
      chainId: 80001,
      verifyingContract,
    },
    types: {
      ReputationRequest: [
        { name: 'repId', type: 'uint256' },
        { name: 'claimedValue', type: 'uint256' },
        { name: 'destination', type: 'address' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    message: {
      repId: request.claims[0].repId,
      claimedValue: request.claims[0].claimedValue,
      destination: request.destination,
      deadline
    },
  };
};

export const generateProofData = async (
  request:any,
  signer: Wallet,
  verifyingContract: string,
  chainId: number,
  domainName: string
) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const deadline = Math.floor(tomorrow.getTime() / 1000);
  const signData = generateEIP712TypedSignData(
    request,
    verifyingContract,
    deadline,
    domainName,
  );
  const sig = await signer._signTypedData(
    signData.domain,
    signData.types,
    signData.message
  );
  const { r, s, v } = utils.splitSignature(sig);
  return ethers.utils.defaultAbiCoder.encode(
    ["uint8", "bytes32", "bytes32", "uint256"],
    [v, r, s, deadline]
  );
};
