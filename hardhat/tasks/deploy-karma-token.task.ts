import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { wrapCommonDeployOptions } from './deployment';


async function deploymentAction(
  {
    tokenManager,
  }:any,
  hre: HardhatRuntimeEnvironment
) {
  const KarmaToken = await hre.ethers.getContractFactory("KarmaToken");
  const karmaToken = await KarmaToken.deploy(tokenManager);
  console.log(`\n karmaToken: ${karmaToken.address}`)
  return karmaToken;
}

task('deploy-karma-token')
  .addOptionalParam('tokenManager', 'tokenManager')
  .setAction(wrapCommonDeployOptions(deploymentAction));
