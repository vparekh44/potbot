import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { supabaseService } from "../../../lib/supabaseServiceClient";
import jwt, { Secret } from "jsonwebtoken";

const verifyNonce = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      walletAddress: walletAddressMixedCase,
      signature,
      nonce,
    } = req.body;

    if (!walletAddressMixedCase || !signature || !nonce) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    const walletAddress = walletAddressMixedCase.toLowerCase();

    const signerAddress = ethers.utils
      .verifyMessage(nonce, signature)
      .toLowerCase();

    if (signerAddress !== walletAddress) {
      res.status(400).json({ status: "Fail", message: "Wrong signature" });
      return;
    }

    const { data: userData, error: userError } = await supabaseService
      .from("users")
      .select("*, profile:profiles_user_id_fkey(*)")
      .eq("wallet_address", walletAddress)
      .eq("nonce", nonce)
      .single();


    if (userError) {
      res.status(400).json({ status: "Fail", message: "User is not found" });
      return;
    }

    const user = {
      id: userData.id,
      walletAddress: userData.wallet_address,
    };
    const token = jwt.sign(
      {
        aud: "authenticated",
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 12), // Expiring in 12h
        sub: userData.id,
        user_metadata: {
          id: userData.id,
          address: walletAddress,
        },
        role: "authenticated",
      },
      process.env.SUPABASE_JWT_SECRET as Secret
    );

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ error });
    return;
  }
};

export default verifyNonce;
