import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { wrapCommonDeployOptions } from './deployment';


async function deploymentAction(
  {
  }:any,
  hre: HardhatRuntimeEnvironment
) {
  const KarmaTokenManager = await hre.ethers.getContractFactory("KarmaTokenManager");
  const karmaTokenManager = await KarmaTokenManager.deploy();
  console.log(`\n karmaTokenManager: ${karmaTokenManager.address}`)
  return karmaTokenManager;
}

task('deploy-karma-token-manager')
  .setAction(wrapCommonDeployOptions(deploymentAction));
