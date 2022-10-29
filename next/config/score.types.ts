import { BigNumberish } from "ethers";

export type GithubGroupProperties = {
  groupIndex: BigNumberish;
  generationTimestamp: number;
};

export type DecodedSignatureAttesterBadgeExtraData = {
  cId: string;
  updatedAt: string;
  badgeData: string;
};

export type SignatureGroupProperties = {
  groupIndex: BigNumberish;
  generationTimestamp: number;
  badgeType: "identity" | "credential" | "skill";
  source: "github" | "course" | "other";
  badgeData: string; // bytes extra badge data
};

export type IdentityBadgeData = {
  accountId: string;
  username: string;
};
