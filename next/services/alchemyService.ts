import alchemy from "../lib/alchemy";

// Fetch NFTS
export const getNFTsFromWallet = async (wallet: string) => {
  // Get all NFTs
  const nfts = await alchemy.nft.getNftsForOwner(wallet);
  // Print NFTs
  debugger;
  console.log(nfts);
};
