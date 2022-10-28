import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt, { Jwt } from "jsonwebtoken";

export default function withJwtAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { headers } = req;
    let accessToken = headers.authorization;

    if (!accessToken)
      return res.status(403).json({ error: "Authorization Not Provided!" });

    accessToken = accessToken.split(" ")[1];
    const isVerified = await jwt.verify(
      accessToken as string,
      process.env.SUPABASE_JWT_SECRET as string
    );

    if (!isVerified) return res.status(403).json({});

    const payload = jwt.decode(accessToken) as jwt.JwtPayload;

    const userId = payload?.user_metadata?.id;
    if (!userId)
      return res.status(403).json({ error: "User ID not identified" });
    return handler(req, res);
  };
}
