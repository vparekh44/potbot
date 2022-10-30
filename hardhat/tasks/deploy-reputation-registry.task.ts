import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { wrapCommonDeployOptions } from './deployment';


async function deploymentAction(
  {
    badges ,
  }:any,
  hre: HardhatRuntimeEnvironment
) {
  const ReputationRegistry = await hre.ethers.getContractFactory("ReputationRegistry");
  const reputationRegistry = await ReputationRegistry.deploy(badges );
  console.log(`\n reputationRegistry: ${reputationRegistry.address}`)
  return reputationRegistry;
}

task('deploy-reputation-registry')
  .addOptionalParam('badges', 'badge contract')
  .setAction(wrapCommonDeployOptions(deploymentAction));
