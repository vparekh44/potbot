import { create } from "ipfs-http-client";
import { NextApiRequest, NextApiResponse } from "next";
import withJwtAuth from "../../../middleware/withJwtAuth";

async function save(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async () => {
    try {
      debugger;
      const { body, headers } = req;

      // connect to the default API address http://localhost:5001
      const client = create();

      // call Core API methods
      const { cid } = await client.add("Hello world!");
      debugger;
      res.status(200).json({ message: cid });
    } catch (error) {
      res.status(500);
    }
  });
}

export default withJwtAuth(save);
