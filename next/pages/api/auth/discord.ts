import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { supabaseAdmin } from "../../../lib/supabaseAdminClient";

const addOauthToken = async (user_id: string, token: string) => {
  const tokenObject = {
    id: uuid(),
    user_id,
    token,
  };

  const query = supabaseAdmin.from("discord_integrations").insert(tokenObject);
  const { data, error: err } = await query;
  return { data, err };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.redirect("/");
  const { code = null, error = null, state } = req.query;
  const { userId, walletAddress } = JSON.parse(state as string);

  const config = {
    cookieName: "token",
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    appUri: process.env.NEXT_PUBLIC_APP_URI,
    discordToken: process.env.DISCORD_TOKEN,
  } as const;

  const scope = ["identify"].join(" ");
  const REDIRECT_URI = `${config.appUri}/api/auth/discord`;

  const OAUTH_QS = new URLSearchParams({
    client_id: config.clientId || "",
    redirect_uri: REDIRECT_URI || "",
    response_type: "code",
    scope,
  }).toString();
  const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

  if (error) {
    return res.redirect(`/?error=${req.query.error}`);
  }

  if (!code || typeof code !== "string") {
    return res.redirect(`${OAUTH_URI}`);
  }

  const body = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "",
    client_secret: process.env.DISCORD_CLIENT_SECRET || "",
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code,
    scope,
  }).toString();

  const { access_token = null, token_type = "Bearer" } = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body,
    }
  ).then((res: any) => {
    const x = res.json();
    return x;
  });

  if (!access_token || typeof access_token !== "string") {
    return res.redirect(OAUTH_URI);
  }

  const { err }: any = await addOauthToken(userId, access_token);

  if (err) {
    console.log("error", err);
    res.redirect(`?integration_success=false&user_id=${userId}`);
  } else {
    res.redirect(`?integration_success=true&user_id=${userId}`);
  }
};
