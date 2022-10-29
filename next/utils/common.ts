import { ethers, utils, Wallet } from "ethers";
import { RequestStruct } from "../smart_contract/types/identity.types";

export const generateEIP712TypedSignData = (
  request: RequestStruct,
  verifyingContract: string,
  deadline: string | number,
  domainName: string,
  chainId: number
) => {
  return {
    primaryType: "AttestationRequest",
    domain: {
      name: domainName,
      version: "1",
      chainId,
      verifyingContract,
    },
    types: {
      AttestationRequest: [
        { name: "groupId", type: "uint256" },
        { name: "claimedValue", type: "uint256" },
        { name: "extraData", type: "bytes" },
        { name: "destination", type: "address" },
        { name: "deadline", type: "uint256" },
      ],
    },
    message: {
      groupId: request.claims[0].groupId,
      claimedValue: request.claims[0].claimedValue,
      extraData: request.claims[0].extraData,
      destination: request.destination,
      deadline,
    },
  };
};

export const generateProofData = async (
  request: RequestStruct,
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
    chainId
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
