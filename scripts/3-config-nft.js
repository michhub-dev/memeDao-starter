import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";
import { Script } from "vm";
//nft contract 
const editionDrop = sdk.getEditionDrop("0xBFb3f589f249C7e09495774177Df16d13B438814");

(async () => {
    try{
        await editionDrop.createBatch ([
            {
                name: "Community Dao",
                description: "This NFT is for meme Dao community",
                image: readFileSync("scripts/assets/images2.jpg"),

            }
            
        ])
        console.log("Successfully created new NFT in the drop!");
    } 
    catch(error) {
        console.error("Failed to create new NFT",error)
    }
})(); 