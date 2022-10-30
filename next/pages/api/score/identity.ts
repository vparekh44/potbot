import { ethers, BigNumberish, utils, Wallet } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { chain } from 'wagmi';
import withJwtAuth from '../../../middleware/withJwtAuth';
import jwt from 'jsonwebtoken';
import { SignatureGroupProperties } from '../../../config/score.types';
import { CHAIN_INFO } from '../../../config/chain';

async function attest(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async () => {
    try {
      const { body, headers } = req;
      const { id, username, pName, destination } = body;

      const { walletSecretKey, identityContract, rpcUrl, chainId } =
        getChainInfo();

      if (!walletSecretKey || !identityContract)
        return res.status(404).json({ error: 'Missing configuration' });

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const signer = new ethers.Wallet(walletSecretKey, provider);

      const request = generateCredRequest(id, username, pName, destination);

      const proofData = await generateProofData(
        request,
        signer,
        identityContract,
        chainId,
        'Identity'
      );
      return res.status(200).json({ request, proofData });
    } catch (error) {
      console.log(error);
      return res.status(400).end();
    }
  });
}

const getChainInfo = () => {
  let walletSecretKey;
  let identityContract;
  let rpcUrl;
  let chainId;

  identityContract =
    CHAIN_INFO[chain.polygonMumbai.id].contracts?.identity?.address;
  rpcUrl = CHAIN_INFO[chain.polygonMumbai.id].rpcUrl[0];
  chainId = chain.polygonMumbai.id;
  walletSecretKey = process.env.WALLET_S_KEY;

  return { walletSecretKey, identityContract, rpcUrl, chainId };
};

const generateCredRequest = (
  id: BigNumberish,
  username: string,
  pName:string,
  destination: string
) => {
  return {
    provider: [
      {
        id,
        username,
        pName
      },
    ],
    destination,
  };
};




export const generateEIP712TypedSignData = (
  request: any,
  verifyingContract: string,
  deadline: string | number,
  domainName: string
) => {
  return {
    primaryType: 'RegisterProviderRequest',
    domain: {
      name: domainName,
      version: '1',
      chainId: 80001,
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

export const generateProofData = async (
  request:any,
  signer: Wallet,
  verifyingContract: string,
  chainId: number,
  domainName: string
) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const deadline = Math.floor(tomorrow.getTime() / 1000);
  const signData = generateEIP712TypedSignData(
    request,
    verifyingContract,
    deadline,
    domainName,
  );
  const sig = await signer._signTypedData(
    signData.domain,
    signData.types,
    signData.message
  );
  const { r, s, v } = utils.splitSignature(sig);
  return ethers.utils.defaultAbiCoder.encode(
    ["uint8", "bytes32", "bytes32", "uint256"],
    [v, r, s, deadline]
  );
};

export default withJwtAuth(attest);
