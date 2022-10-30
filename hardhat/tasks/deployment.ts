import { HardhatRuntimeEnvironment } from 'hardhat/types';

export const wrapCommonDeployOptions = (action: Function) => {
  return (args: any, hre: HardhatRuntimeEnvironment) => {
    return action(
      {
        ...args,
      },
      hre
    );
  };
};
