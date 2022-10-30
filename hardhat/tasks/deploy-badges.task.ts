import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { wrapCommonDeployOptions } from './deployment';


async function deploymentAction(
  {
    uri,
  }:any,
  hre: HardhatRuntimeEnvironment
) {
  const Badges = await hre.ethers.getContractFactory("Badges");
  const badges = await Badges.deploy(uri);
  console.log(`\n Badges: ${badges.address}`)
  return badges;
}

task('deploy-badges')
  .addOptionalParam('uri', 'uri')
  .setAction(wrapCommonDeployOptions(deploymentAction));
