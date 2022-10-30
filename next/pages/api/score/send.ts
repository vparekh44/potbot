import { ethers, BigNumberish } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { chain } from 'wagmi';
import withJwtAuth from '../../../middleware/withJwtAuth';
import jwt from 'jsonwebtoken';
import { SignatureGroupProperties } from '../../../config/score.types';
import { generateProofData } from '../../../utils/common';
import { CHAIN_INFO } from '../../../config/chain';

async function attest(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async () => {
    try {
      const { body, headers } = req;
      const { score, destination } = body;

      const { walletSecretKey, signatureVerifierContract, rpcUrl, chainId } =
        getChainInfo();

      if (!walletSecretKey || !signatureVerifierContract)
        return res.status(404).json({ error: 'Missing configuration' });

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const signer = new ethers.Wallet(walletSecretKey, provider);

      const request = generateCredRequest(0, score, destination);

      const proofData = await generateProofData(
        request,
        signer,
        signatureVerifierContract,
        chainId,
        'SignatureVerifier'
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
  let signatureVerifierContract;
  let rpcUrl;
  let chainId;

  signatureVerifierContract =
    CHAIN_INFO[chain.polygonMumbai.id].contracts?.signatureVerifier?.address;
  rpcUrl = CHAIN_INFO[chain.polygonMumbai.id].rpcUrl[0];
  chainId = chain.polygonMumbai.id;
  walletSecretKey = process.env.WALLET_S_KEY;

  return { walletSecretKey, signatureVerifierContract, rpcUrl, chainId };
};

const generateCredRequest = (
  repId: BigNumberish,
  claimedValue: BigNumberish,
  destination: string
) => {
  return {
    claims: [
      {
        repId,
        claimedValue,
      },
    ],
    destination,
  };
};


export default withJwtAuth(attest);
