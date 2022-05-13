import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";
import { Script } from "vm";

const editionDrop = sdk.getEditionDrop("editionDropInfo address");

(async () => {
    try{
        await editionDrop.createBatch ([
            {
                name: "Community Dao",
                description: "This NFT is for meme Dao community",
                image: readFileSync(Scripts/assets/images2.jpg),

            }
            
        ])
        console.log("Successfully created new NFT in the drop!");
    } 
    catch(error) {
        console.error("Failed to create new NFT",error)
    }
})(); 