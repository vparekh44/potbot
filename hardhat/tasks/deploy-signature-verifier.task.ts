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
    verifier,
  }: any,
  hre: HardhatRuntimeEnvironment
) {
  const SignatureVerifier = await hre.ethers.getContractFactory('SignatureVerifier');
  const signatureVerifier = await SignatureVerifier.deploy(
    reputationRegistry,
    karmaTokenManager,
    identity,
    BigNumber.from(1),
    verifier
  );
  console.log(`\n signatureVerifier: ${signatureVerifier.address}`)
  return signatureVerifier;
}

task('deploy-signature-verifier')
  .addOptionalParam('reputationRegistry', 'reputationRegistry')
  .addOptionalParam('karmaTokenManager', 'karmaTokenManager')
  .addOptionalParam('identity', 'identity')
  .addParam('karmaTokenAmount', 'karmaTokenAmount')
  .addOptionalParam('verifier', 'verifier')
  .setAction(wrapCommonDeployOptions(deploymentAction));
