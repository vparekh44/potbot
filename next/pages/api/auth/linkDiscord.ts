import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdminClient";
import jwt from "jsonwebtoken";
import axios from "axios";

const getAccessToken = async ({ user_id, provider }: any) => {
  const query = supabaseAdmin
    .from("discord_integrations")
    .select("token")
    .eq("user_id", user_id);

  const { data, error: err } = await query;
  return { data, err };
};

const deleteStaleRow = async (userId: string) => {
  await supabaseAdmin
    .from("discord_integrations")
    .delete()
    .eq("user_id", userId);
};

const updateProviderId = async ({ user_id, token, discord_id }: any) => {
  const query = supabaseAdmin
    .from("discord_integrations")
    .update({ token, discord_id })
    .eq("user_id", user_id);

  const { data, error: err } = await query;
  return { data, err };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body, headers } = req;

    const refId = (body && body.refId ? body.refId : {}) as string;
    if (!refId)
      return res.status(403).json({ error: "Parameters not provided" });

    let accessToken = headers.authorization;
    const obtainedUserId = headers.userid;

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

    const accessTokenData = await getAccessToken({
      user_id: userId,
    });

    if (!accessTokenData.data?.length) {
      if (obtainedUserId !== userId) {
        deleteStaleRow(obtainedUserId as string);
      }
      return res.status(400).json({ error: "No user found!" });
    }
    const { data: discordUserData } = await axios.get(
      "http://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessTokenData.data[0].token}`,
        },
      }
    );

    if (!discordUserData) {
      return res.status(400).json({ error: "Error with Discord data!" });
    }
    const { data, err } = await updateProviderId({
      user_id: userId,
      token: accessTokenData.data[0].token,
      discord_id: discordUserData.id,
    });
    if (err) {
      return res.status(400).json({ error: "going from here" });
    }
    return res.status(200).json({ message: "success" });
  } catch (error) {
    // console.log("Error in linkdiscord ", error);
    // logtail?.error("Error with referralApi.");
    return res.status(400).json({ error });
  }
};
