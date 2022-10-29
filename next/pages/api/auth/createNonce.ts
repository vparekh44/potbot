import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { supabaseService } from "../../../lib/supabaseServiceClient";

// Used as an endpoint for nonce creation or update.
const createNonce = async (req: NextApiRequest, res: NextApiResponse) => {
  const { walletAddress: walletAddressMixedCase } = req.body;
  if (!walletAddressMixedCase) {
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }

  const walletAddress = walletAddressMixedCase.toLowerCase();

  const nonce = `You know, for authentication. ${uuid()}`;

  const { data: nonceData, error: nonceError } = await supabaseService
    .from("users")
    .select("nonce")
    .eq("wallet_address", walletAddress);

  if (nonceError) {
    res.status(400).json({ error: "Failed to check for nonce existence" });
    return;
  }

  if (nonceData && nonceData?.length > 0) {
    // If nonce exists, update it.
    const { error } = await supabaseService
      .from("users")
      .update({ nonce })
      .match({ wallet_address: walletAddress });

    if (error) {
      res.status(400).json({ error: "Failed to update the nonce" });
      return;
    }

    res.status(200).json({ nonce });
    return;

  } else {
    // If nonce does not exist, create it.
    const newUserId = uuid();

    const { error } = await supabaseService.from("users").insert({
      id: newUserId,
      nonce,
      wallet_address: walletAddress,
    });

    if (error) {
      res.status(400).json({ error: "Failed to create the nonce" });
      return;
    }

    // Adds new profile document
    const { error: addProfileError } = await supabaseService
      .from("profiles")
      .insert({
        user_id: newUserId,
      });

    if (addProfileError) {
      if (error) {
        res.status(400).json({ error: "Failed to create the profile" });
        return;
      }
    }

    res.status(200).json({ nonce });
    return;
  }
};

export default createNonce;
