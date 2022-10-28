import { NextApiRequest, NextApiResponse } from "next";
import withJwtAuth from "../../../middleware/withJwtAuth";

function handler(req: NextApiRequest, res: NextApiResponse) {
  // insert supabase function to get information from the user

  // return the information about the user.
  res.status(200).json({ error: false });
}

export default withJwtAuth(handler);
