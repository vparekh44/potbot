import { create } from "ipfs-http-client";

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID_IPFS;
const INFURA_SECRET = process.env.INFURA_SECRET_IPFS;

const auth = "Basic " + Buffer.from(INFURA_ID + ":" + INFURA_SECRET).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (data: string | Buffer[]): Promise<string | null> => {
  try {
    if (data === null) {
      return null;
    }
    const { cid } = await client.add(data, { pin: true });
    return cid.toString();
  } catch (error) {
    console.log(error);
    return null;
  }
};
