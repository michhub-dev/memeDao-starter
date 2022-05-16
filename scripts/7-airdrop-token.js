import sdk from "./1-initialize-sdk.js";
/// AirDrop token
// the address of ERC-1155 membership NFT contract
const editionDrop = await sdk.getEditionDrop("0xBFb3f589f249C7e09495774177Df16d13B438814");

const token = await sdk.getToken("0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec");

(async () => {
    try {
      /// grap addresses of people who own our membership NFT, with the tokenId of 0
      const membersAddress = await editionDrop.history.getAllClaimerAddresses("0");

      if (membersAddress.length === 0) {
          console.log("No NFT has been claimed yet, get your friends to claim your NFT");
          process.exit(0);
      }

    } catch (err) {
        console.log("Failed to airdrop token", err);
    }
})();