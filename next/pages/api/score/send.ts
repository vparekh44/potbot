import { ethers, BigNumberish } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { chain } from "wagmi";
import withJwtAuth from "../../../middleware/withJwtAuth";
import jwt from "jsonwebtoken";
import { SignatureGroupProperties } from "../../../config/score.types";
import { generateProofData } from "../../../utils/common";
import { CHAIN_INFO } from "../../../config/chain";

async function attest(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async () => {
    try {
      const { body, headers } = req;

      // I checked already for the JWT Token on the withJwt. just need the payload
      let accessToken = headers.authorization || "";

      const payload = jwt.decode(accessToken) as jwt.JwtPayload;

      const owner = payload?.user_metadata?.address;
      if (!owner) return res.status(403).json({ error: "Address not present" });

      const { walletSecretKey, signatureAttesterContract, rpcUrl, chainId } =
        getChainInfo();

      if (!walletSecretKey || !signatureAttesterContract)
        return res.status(404).json({ error: "Missing configuration" });

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const signer = new ethers.Wallet(walletSecretKey, provider);

      // TODO: This score is mocked in order to test
      const request = generateCredRequest(owner, 1, owner);

      const proofData = await generateProofData(
        request,
        signer,
        signatureAttesterContract,
        chainId,
        "SignatureAttester"
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
  let signatureAttesterContract;
  let rpcUrl;
  let chainId;

  if (process.env.NEXT_PUBLIC_BADGES_MAINNET_MODE === "true") {
    walletSecretKey = process.env.POT_POLYGON_MAINNET_WALLET_SECRET_KEY;
    signatureAttesterContract =
      CHAIN_INFO[chain.polygon.id].contracts?.signatureVerifier?.address;
    rpcUrl = CHAIN_INFO[chain.polygon.id].rpcUrl[0];
    chainId = chain.polygon.id;
  } else {
    walletSecretKey = process.env.RINKEBY_WALLET_SECRET_KEY;
    signatureAttesterContract =
      CHAIN_INFO[chain.goerli.id].contracts?.signatureVerifier?.address;
    rpcUrl = CHAIN_INFO[chain.goerli.id].rpcUrl[0];
    chainId = chain.goerli.id;
  }

  return { walletSecretKey, signatureAttesterContract, rpcUrl, chainId };
};

const generateCredRequest = (
  groupId: BigNumberish,
  claimedValue: number,
  destination: string
) => {
  return {
    claims: [
      {
        groupId,
        claimedValue,
        extraData: encodeSignatureGroupProperties(
          generateCredentialGroupProperties(groupId)
        ),
      },
    ],
    destination,
  };
};

export const generateCredentialGroupProperties = (
  groupIndex: BigNumberish
): SignatureGroupProperties => {
  const generationTimestamp = Math.round(Date.now() / 1000);
  return {
    groupIndex,
    generationTimestamp,
    badgeType: "credential",
    source: "course",
    badgeData: "0x",
  };
};

export const encodeSignatureGroupProperties = (
  groupProperties: SignatureGroupProperties
): string => {
  return ethers.utils.defaultAbiCoder.encode(
    ["tuple(uint128,uint32,string,string,bytes)"],
    [
      [
        groupProperties.groupIndex,
        groupProperties.generationTimestamp,
        groupProperties.badgeType,
        groupProperties.source,
        groupProperties.badgeData,
      ],
    ]
  );
};

export default withJwtAuth(attest);
