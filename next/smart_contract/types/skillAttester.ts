import { BigNumberish } from "ethers";

export type SkillGroupProperties = {
  groupIndex: BigNumberish;
  generationTimestamp: number;
  skill: string;
};
