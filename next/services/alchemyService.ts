import alchemy from "../lib/alchemy";

// Fetch NFTS
export const getRandomNFTFromAWallet = async (wallet: string) => {
  // Get all NFTs
  const nfts = await alchemy.nft.getNftsForOwner(wallet);

  const randomElement =
    nfts.ownedNfts[Math.floor(Math.random() * nfts.ownedNfts.length)];

  return randomElement && randomElement.media && randomElement.media[0].gateway;
};
