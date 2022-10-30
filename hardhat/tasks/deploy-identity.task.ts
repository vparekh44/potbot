import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { wrapCommonDeployOptions } from './deployment';


async function deploymentAction(
  {
    verifier,
  }:any,
  hre: HardhatRuntimeEnvironment
) {
  const Identity = await hre.ethers.getContractFactory("Identity");
  const identity = await Identity.deploy(verifier);
  console.log(`\n identity: ${identity.address}`)
  return identity;
}

task('deploy-identity')
  .addOptionalParam('verifier', 'verifier')
  .setAction(wrapCommonDeployOptions(deploymentAction));
