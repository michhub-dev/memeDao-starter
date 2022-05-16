import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
 const tokenAddress = await sdk.deployer.deployToken({
            name: "Meme Dao governance Token",
            symbol: "MDT",
            primary_sale_recipient: AddressZero,

        });
        console.log("Successfully deployed token module, Address:", tokenAddress,);
    } catch (error) {
        console.log("Failed to deploy token module", error);
    }
})();