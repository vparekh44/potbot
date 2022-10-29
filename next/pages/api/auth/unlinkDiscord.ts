import axios from "axios";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdminClient";

const unlinkDiscord = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body, headers } = req;

    const refId = (body && body.refId ? body.refId : {}) as string;
    if (!refId)
      return res.status(403).json({ error: "Parameters not provided" });

    let accessToken = headers.authorization;

    if (!accessToken)
      return res.status(403).json({ error: "Access Token Not provided" });

    accessToken = accessToken.split(" ")[1];
    const isVerified = await jwt.verify(
      accessToken as string,
      process.env.SUPABASE_JWT_SECRET as string
    );

    if (!isVerified) return res.status(403).json({});

    const payload = jwt.decode(accessToken);

    // @ts-ignore
    const userId = payload?.user_metadata?.id;
    if (!userId)
      return res.status(403).json({ error: "User ID not identified" });

    const { data, error } = await supabaseAdmin
      .from("discord_integrations")
      .delete()
      .match({ user_id: userId });

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export default unlinkDiscord;
