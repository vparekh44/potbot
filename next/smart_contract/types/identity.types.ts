import { BigNumberish, BytesLike } from "ethers";

export type IdentityGroupProperties = {
  groupIndex: number;
  generationTimestamp: number;
  identityType: string;
};

export type ClaimStruct = {
  groupId: BigNumberish;
  claimedValue: BigNumberish;
  extraData: BytesLike;
};

export type RequestStruct = { claims: ClaimStruct[]; destination: string };

export type DecodedIdentityExtraData = {
  cId: string;
  updatedAt: string;
  identityType: string;
  providerId: string;
  username: string;
};
