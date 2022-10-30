/* eslint-disable prefer-const */
// import { NextApiRequest, NextApiResponse } from "next";
// import fs from "fs";
// import nodeHtmlToImage from "node-html-to-image";
// import font2base64 from "node-font2base64";
import { uploadToIPFS } from "../../api/upload/ipfs";
import { ethers } from "ethers";
// import bountyNFTAbi from "../../../contract/abi/BountyNFT.json";
// import { supabaseAdmin } from "../utils/supabaseAdminClient";
import Image from "next/image";
import { useCookies } from "react-cookie";

// import axios from "axios";
// import BountyPayment, {
//   BOUNTY_PAYMENTS_TABLE,
//   BOUNTY_PAYMENTS_TABLE_NAME,
// } from "../../../models/bountyPayment";
// import { getAdminProfiles } from "../../../services/daosServices";
// import path from "path";
// import DAO from "../../../models/dao";
// import Bounty from "../../../models/bounty";
// import { Profile } from "../../../models/profile";
// import { getNextNonce } from "../utils/web3utils";
// import { calcGas } from "../../../lib/web3utils";
import { ChangeEvent, useState } from "react";
import { ACCESS_TOKEN_COOKIE, useUserData } from "../../../contexts/AuthContext";
import { ImageUploader } from "../../../components/ImageUploarder";

const bountyNFTContractAddress = process.env.NEXT_PUBLIC_POLYGON_MUMBAINET_CONTRACT;
const rpcUrl = "https://polygon-mainnet.infura.io/v3/";
const walletSecretKey = process.env.POLYGON_MUMBAINET_WALLET_SECRET_KEY;


const imageGenApi = process.env.NFT_IMAGE_GEN_API;

/*
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    return new Promise<void>(async () => {
        try {
            const hash = await uploadToIPFS(JSON.stringify(data));

            if (!hash)
            return res.status(400).json({ status: "Fail", message: "Invalid data" });

            const metaDataUrl = `ipfs://${hash}`;
            const resp = await mintNft(application[0]?.applicant?.username, metaDataUrl);

        } catch (error) {
            return res.status(400).json({ status: "Fail", message: "Failed to mint bounty NFT" });
        }
    });
}
*/

export const checkTransactionStatus = async (transactionHash: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `${rpcUrl}${process.env.NEXT_PUBLIC_INFURA_ID}`
  );
  const txRcpt = await provider.getTransactionReceipt(transactionHash);
  return txRcpt !== null;
};


/*
const generateImage = async (application: BountyApplication & { dao: DAO }) => {
  try {
    const imagesDir = path.resolve("./public", "images");
    const image = fs.readFileSync(path.join(imagesDir, "cred-green.png"));
    const base64Image = Buffer.from(image).toString("base64");
    const dataURI = "data:image/jpeg;base64," + base64Image;
    const fontsDir = path.resolve("./public", "fonts");
    const _outfit = await font2base64.encodeToDataUrl(
      path.join(fontsDir, "Outfit/static/Outfit-Regular.ttf")
    );
    const _spaceMonoBold = await font2base64.encodeToDataUrl(
      path.join(fontsDir, "Space_Mono/SpaceMono-Bold.ttf")
    );
    const _spaceMonoRegular = await font2base64.encodeToDataUrl(
      path.join(fontsDir, "Space_Mono/SpaceMono-Regular.ttf")
    );

    let daoImagedataURI;
    if (application?.dao?.logo_url) {
      const daoImage = await axios.get(application?.dao?.logo_url, { responseType: "arraybuffer" });
      const daoImagebase64 = Buffer.from(daoImage.data).toString("base64");
      daoImagedataURI = "data:image/jpeg;base64," + daoImagebase64;
    } else {
      const daoImage = fs.readFileSync(path.join(imagesDir, "placeholder.png"));
      const daoImagebase64 = Buffer.from(daoImage).toString("base64");
      daoImagedataURI = "data:image/jpeg;base64," + daoImagebase64;
    }

    const provider = new ethers.providers.InfuraProvider(1, process.env.NEXT_PUBLIC_INFURA_ID);
    const applicantEnsName = await provider.lookupAddress(application?.applicant?.username);

    const genImage = await nodeHtmlToImage({
      html: `
      <html>
        <head>
          <style>
          @font-face {
            font-family: 'Outfit';
            src: url(${_outfit}) format('woff2');
          }
          @font-face {
            font-family: 'Space Mono Regular';
            src: url(${_spaceMonoRegular}) format('woff2');
          }
          @font-face {
            font-family: 'Space Mono Bold';
            src: url(${_spaceMonoBold}) format('woff2');
          }
          body {
            margin: 0;
            background-color: rgb(0, 0, 0);
            width: fit-content;
            height: fit-content;
          }
          .image {
            position: relative;
            border-radius: 10px;
          }
          .daoImage {
            position: absolute;
            top: 16%;
            left: 18.3%;
            max-width: 120px;
            max-height: 120px;
            border-radius: 8px;
          }
          .dao {
            position: absolute;
            top: 19%;
            left: 32.5%;
            color: #717D7F;
            font-family: "Outfit";
            font-size: 32px;
            max-width: 500px;
            max-height: 150px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          .issueDate {
            position: absolute;
            bottom: 13.3%;
            right: 22.7%;
            color: #717D7F;
            font-family: "Outfit";
            font-size: 32px;
          }
          .title {
            color: #717D7F;
            font-family: "Space Mono Bold";
            font-size: 48px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          .reward {
            color: #4B5658;
            font-family: "Space Mono Regular";
            font-size: 48px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          .address {
            color: #717D7F;
            font-family: "Space Mono Bold";
            overflow-wrap: break-word;
            font-size: 40px;
            margin-top: 5rem !important;
            max-width: 600px;
          }
          .addressLabel {
            color: #717D7F;
            font-family: "Space Mono Bold";
            font-size: 35px;
          }
          .mainDiv {
            position: absolute;
            top: 30%;
            left: 18%;
            display: flex;
            flex-direction: column;
            max-width: 700px;
          }
          .mainDiv > h2 {
            margin: 0;
          }
          </style>
        </head>
        <body>
          <img class="image" src="{{imageSource}}"/>
          <img class="daoImage" src="{{daoImageSource}}"/>
          <h2 class="dao">{{dao}}</h2>
          <h2 class="issueDate">{{issueDate}}</h2>
          <div class="mainDiv">
            <h2 class="title">{{title}}</h2>
            <h2 class="reward">REWARD: {{reward}}</h2>
            <h2 class="address"><span class="addressLabel">TO:</span><br/> {{applicant}}</h2>
          </div>
        </body>
      </html>`,
      content: {
        imageSource: dataURI,
        title: application?.bounty?.title?.toUpperCase(),
        applicant: applicantEnsName || application?.applicant?.username,
        dao: application?.dao?.name,
        issueDate: application?.bounty?.updated_at
          ? new Date(application?.bounty?.updated_at).toLocaleDateString("en-GB")
          : new Date().toLocaleDateString("en-GB"),
        daoImageSource: daoImagedataURI,
        reward:
          application?.bounty?.price_token?.toString() + " " + application?.bounty?.token_slug,
      },
    });
    return genImage;
  } catch (error) {
    return null;
  }
};
*/

const ProfilePictureSection = () => {
    const user = useUserData();
    const [cookies] = useCookies([ACCESS_TOKEN_COOKIE]);


    const [avatarUrl, setAvatarUrl] = useState(""); // profileInfo?.avatar_url
  
    const isFileValid = (file: any) => {
      const type = file.type.split("/").pop();
      const validTypes = ["png", "jpeg", "jpg", "gif"];
      if (validTypes.indexOf(type) === -1) {
        return false;
      }
      return true;
    };
  
    const uploadFile = async (event: ChangeEvent, type: "avatar" | "banner") => {
      event.preventDefault();
  
      const target = event.target as HTMLInputElement;
      // @ts-ignore
      const file = target.files[0];
      const formData = new FormData();
  
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          access_token: cookies.access_token,
          type: type,
        },
      };
  
      formData.append("file", file);
  
      if (!isFileValid(file)) {
        console.error("Invalid format");
      }
      try {
        if (user) {
    
          // const updateObject = { avatar_url: response?.data?.url };
  
          // setAvatarUrl(response?.data?.url);

          const imageHash = await uploadToIPFS(file as unknown as Buffer[]);

          console.log("imageHash", imageHash)

  
        }
      } catch (error) {
        console.log(error)
      }
    };

    return (
        <>
          <div className=" flex h-full flex-col items-center justify-between md:h-2/3">
            <span className="flex w-full  max-w-screen-md flex-col items-center justify-center gap-10  py-16 md:flex-row">
              {avatarUrl ? (
                <div className="relative h-40 w-40 flex-none overflow-hidden rounded-xl">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-40 h-40 rounded-full"></div>
                  <ImageUploader isLoading={false} onUpload={(event) => uploadFile(event, "avatar")} />
                </div>
              ) : (
                <div className="relative h-40 w-40 flex-none overflow-hidden rounded-xl">
                                 <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-40 h-40 rounded-full"></div>

                  <ImageUploader onUpload={(event) => uploadFile(event, "avatar")} isLoading={false} />
                </div>
              )}
            </span>

          </div>
    

        </>
      );
    };


const ProfilePicture = () => {
    return(
        <ProfilePictureSection/>
    )
}


export default ProfilePicture;
/* 
const generateMetadata = async (
  transactionHash: string,
) => {
  try {
    // if (!imageGenApi) return null;
    // const response = await fetch(imageGenApi, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     application,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    if (!response.ok) return null;
    const image = (await response.json())?.data;
    if (!image) return null;

    const imageHash = await uploadToIPFS(image as unknown as Buffer[]);
    if (!imageHash) return null;


    // const data = {
    //   name: application?.bounty?.title,
    //   external_url: "https://kleoverse.com/bounty/" + application?.bounty?.id,
    //   description: application?.bounty?.description,
    //   image: `ipfs://${imageHash}`,
    //   attributes: [
    //     {
    //       trait_type: "DAO",
    //       value: application?.dao?.name,
    //     },
    //     {
    //       trait_type: "DAO Admin",
    //       value: admins![0]?.username,
    //     },
    //     {
    //       trait_type: "Applicant Address",
    //       value: application?.applicant?.username,
    //     },
    //     {
    //       trait_type: "Bounty Amount",
    //       value:
    //         application?.bounty?.price_token?.toString() + " " + application?.bounty?.token_slug,
    //     },
    //     {
    //       trait_type: "Completed At",
    //       display_type: "date",
    //       value: application?.bounty?.updated_at
    //         ? Math.floor(new Date(application?.bounty?.updated_at).getTime() / 1000)
    //         : Math.floor(new Date().getTime() / 1000),
    //     },
    //   ],
    // };


    const data = {
        image: `ipfs://${imageHash}`,
    };

    return data;
  } catch (error) {
    return null;
  }
};
*/