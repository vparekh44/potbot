import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { wrapCommonDeployOptions } from './deployment';

async function deploymentAction(
  {
    reputationRegistry,
    karmaTokenManager,
    identity,
    karmaTokenAmount,
    lensHub,
  }: any,
  hre: HardhatRuntimeEnvironment
) {
  const LensVerifier = await hre.ethers.getContractFactory('LensVerifier');
  const lensVerifier = await LensVerifier.deploy(
    reputationRegistry,
    karmaTokenManager,
    identity,
    BigNumber.from(1),
    lensHub
  );
  console.log(`\n lensVerifier: ${lensVerifier.address}`)
  return lensVerifier;
}

task('deploy-lens-verifier')
  .addOptionalParam('reputationRegistry', 'reputationRegistry')
  .addOptionalParam('karmaTokenManager', 'karmaTokenManager')
  .addOptionalParam('identity', 'identity')
  .addParam('karmaTokenAmount', 'karmaTokenAmount')
  .addOptionalParam('lensHub', 'lensHub')
  .setAction(wrapCommonDeployOptions(deploymentAction));
