import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import hre, { ethers } from 'hardhat';
import { RequestStruct } from '../typechain-types/contracts/core/Verifier';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Identity, KarmaToken, KarmaTokenManager, LensVerifier, ReputationRegistry, SignatureVerifier } from '../typechain-types';
import { Badges } from '../typechain-types/contracts/core/Badges.sol';
import { BigNumber, utils } from 'ethers';

describe('Whole flow', function () {
  let badges:Badges;
  let reputationRegistry: ReputationRegistry;
  let identity:Identity;
  let karmaToken: KarmaToken;
  let karmaTokenManager: KarmaTokenManager;
  let lensVerifier: LensVerifier;
  let signatureVerifier: SignatureVerifier;
  let request: RequestStruct;
  let providerRequest: Identity.ProviderRequestStruct;
  let signers: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let destination: SignerWithAddress;
  before(async () => {
    signers = await hre.ethers.getSigners();
    [deployer, destination] = signers;
  });
  describe('Deployment', function () {
    it('Should deploy all contracts', async function () {
      ({
        badges,
        reputationRegistry,
        identity,
        karmaToken,
        karmaTokenManager,
        lensVerifier,
        signatureVerifier,
      } = await hre.run('deploy-all', { verifier: deployer.address}));
    });
  });

  describe('', function () {
    it('Should generate identity', async function () {
      const deadline = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      providerRequest = {
        provider: [
          {
            id: 1337,
            username: "username",
            pName: "discord",
          },
        ],
        destination: deployer.address,
      };
      const signData = generateEIP712TypedSignDataProvider(
        providerRequest,
        identity.address,
        deadline,
        'Identity'
      );

      const sig = await deployer._signTypedData(signData.domain, signData.types, signData.message);
      const { r, s, v } = utils.splitSignature(sig);
      const data = ethers.utils.defaultAbiCoder.encode(
        ['uint8', 'bytes32', 'bytes32', 'uint256'],
        [v, r, s, deadline]
      );
      const tx = await identity.registerProviderAndCreateIdentity(providerRequest, data);
      const profileId = await identity.getIdForOwnerUsingProvider("discord", destination.address);
    });

    it('Should generate reputation using signature verifier', async function () {
      const deadline = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      request = {
        claims: [
          {
            repId: 0,
            claimedValue: 2
          },
        ],
        destination: destination.address,
      };
      const signData = generateEIP712TypedSignData(
        request,
        signatureVerifier.address,
        deadline,
        'SignatureVerifier'
      );

      const sig = await deployer._signTypedData(signData.domain, signData.types, signData.message);
      const { r, s, v } = utils.splitSignature(sig);
      const data = ethers.utils.defaultAbiCoder.encode(
        ['uint8', 'bytes32', 'bytes32', 'uint256'],
        [v, r, s, deadline]
      );
      const tx = await signatureVerifier.generateReputations(request, data);
      const { events } = await tx.wait();
      const args = getEventArgs(events, 'ReputationGenerated');

      expect(args.reputation.verifier).to.equal(signatureVerifier.address);
      expect(args.reputation.owner).to.equal(destination.address);
      expect(args.reputation.value).to.equal(2);
    });

    it('Should generate reputation using lens verifier', async function () {
      const deadline = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      request = {
        claims: [
          {
            repId: 0,
            claimedValue: 2
          },
        ],
        destination: destination.address,
      };
      const signData = generateEIP712TypedSignData(
        request,
        signatureVerifier.address,
        deadline,
        'SignatureVerifier'
      );

      const sig = await deployer._signTypedData(signData.domain, signData.types, signData.message);
      const { r, s, v } = utils.splitSignature(sig);
      const data = ethers.utils.defaultAbiCoder.encode(
        ['uint8', 'bytes32', 'bytes32', 'uint256'],
        [v, r, s, deadline]
      );
      const tx = await signatureVerifier.generateReputations(request, data);
      const { events } = await tx.wait();
      const args = getEventArgs(events, 'ReputationGenerated');

      expect(args.reputation.verifier).to.equal(signatureVerifier.address);
      expect(args.reputation.owner).to.equal(destination.address);
      expect(args.reputation.value).to.equal(2);
    });
  });
});

export const generateEIP712TypedSignData = (
  request: RequestStruct,
  verifyingContract: string,
  deadline: string | number,
  domainName: string
) => {
  return {
    primaryType: 'ReputationRequest',
    domain: {
      name: domainName,
      version: '1',
      chainId: hre.network.config.chainId,
      verifyingContract,
    },
    types: {
      ReputationRequest: [
        { name: 'repId', type: 'uint256' },
        { name: 'claimedValue', type: 'uint256' },
        { name: 'destination', type: 'address' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    message: {
      repId: request.claims[0].repId,
      claimedValue: request.claims[0].claimedValue,
      destination: request.destination,
      deadline
    },
  };
};

export const generateEIP712TypedSignDataProvider = (
  request: Identity.ProviderRequestStruct,
  verifyingContract: string,
  deadline: string | number,
  domainName: string
) => {
  return {
    primaryType: 'RegisterProviderRequest',
    domain: {
      name: domainName,
      version: '1',
      chainId: hre.network.config.chainId,
      verifyingContract,
    },
    types: {
      RegisterProviderRequest: [
        { name: 'providerId', type: 'uint256' },
        { name: 'username', type: 'string' },
        { name: 'pName', type: 'string' },
        { name: 'destination', type: 'address' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    message: {
      providerId: request.provider[0].id,
      username: request.provider[0].username,
      pName: request.provider[0].pName,
      destination: request.destination,
      deadline
    },
  };
};

export const getEventArgs = (
  events: any,
  name: string,
  logIndex: number | undefined = undefined
) => {
  const event =
    events &&
    events.find((e: any) =>
      logIndex !== undefined ? e.logIndex === logIndex && e.event === name : e.event === name
    );
  const args = event && event.args;
  return args;
};