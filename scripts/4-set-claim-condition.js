import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0xBFb3f589f249C7e09495774177Df16d13B438814");

(async () =>{
    try{
        const claimConditions = [{
            //when to start claiming the NFT 
            startTime: new Date(),
            maxQuantity: 50_000,
            price: 0,
            //amount of NFT to claim in a Transaction
            quantityLimitPerTransaction: 1,
            waitInSeconds: MaxUint256, 

        }]
        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Successfully set claim condition!");
    } catch(error) {
        console.error("Failed to set claim condition",error);
    }
})();