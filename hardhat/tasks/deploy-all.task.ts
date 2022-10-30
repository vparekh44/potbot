import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { wrapCommonDeployOptions } from './deployment';

async function deploymentAction(
  { verifier }: any,
  hre: HardhatRuntimeEnvironment
) {
  const badges = await hre.run('deploy-badges', {
    uri: 'https://royjlygoakdbzebykdws.supabase.co/storage/v1/object/public/badges/metadata/{id}.json',
  });

  const reputationRegistry = await hre.run('deploy-reputation-registry', {
    badges: badges.address,
  });

  await badges.setReputationRegistry(reputationRegistry.address);

  const identity = await hre.run('deploy-identity', {
    verifier: verifier || '0x4c997D05A3B1C9986D3F7282dC68eF96A07d168f',
  });

  const karmaTokenManager = await hre.run('deploy-karma-token-manager', {});
  const karmaToken = await hre.run('deploy-karma-token', {
    tokenManager: karmaTokenManager.address,
  });

  const lensVerifier = await hre.run('deploy-lens-verifier', {
    reputationRegistry: reputationRegistry.address,
    karmaTokenManager: karmaTokenManager.address,
    identity: identity.address,
    karmaTokenAmount: '1',
    lensHub: '0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5',
  });

  const signatureVerifier = await hre.run('deploy-signature-verifier', {
    reputationRegistry: reputationRegistry.address,
    karmaTokenManager: karmaTokenManager.address,
    identity: identity.address,
    karmaTokenAmount: '1',
    verifier: verifier || '0x4c997D05A3B1C9986D3F7282dC68eF96A07d168f',
  });

  await karmaTokenManager.authorizeVerifier(lensVerifier.address);
  await karmaTokenManager.authorizeVerifier(signatureVerifier.address);
  await karmaTokenManager.setKarmaToken(karmaToken.address);

  return {
    badges,
    reputationRegistry,
    identity,
    karmaToken,
    karmaTokenManager,
    lensVerifier,
    signatureVerifier,
  };
}

task('deploy-all')
  .addOptionalParam('verifier', '')
  .setAction(wrapCommonDeployOptions(deploymentAction));
