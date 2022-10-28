import { NextApiRequest, NextApiResponse } from "next";
import withJwtAuth from "../../../middleware/withJwtAuth";

function handler(req: NextApiRequest, res: NextApiResponse) {
  // send the information to the P** Bot to be processed.

  // return the information about the user.
  res.status(200).json({ error: false });
}

export default withJwtAuth(handler);
