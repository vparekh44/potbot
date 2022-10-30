import { create } from "ipfs-http-client";
import { NextApiRequest, NextApiResponse } from "next";
import { uploadToIPFS } from "../../../lib/ipfsUtils";

async function save(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async () => {
    try {
      const { body, headers } = req;
      if (!body) {
        res.status(500);
      }
      const hash = await uploadToIPFS(JSON.stringify(body));
      res.status(200).json({ message: hash });
    } catch (error) {
      res.status(500);
    }
  });
}

export default save;
