import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try{
        const editionDropInfo = await sdk.deployer.deployEditionDrop({
            //the collection's info 
            name: "Meme Dao",
            description: "My Meme Dao",
            image: readFileSync("scripts/assets/image.png"),
            primary_sale_recipient: AddressZero, 
        });

        ///initialize the contract on the thirdweb sdk
        const editionDrop = await getEditionDrop(editionDropInfo); 
        // get the metadata of the data 
        const metadata = await editionDrop.metadata.get();
        
        console.log("successfully deployed editionDrop contract, address:",editionDropInfo,);
        console.log(" EditionDrop metadata", metadata);
    } catch(error) {
        console.log("Failed to deploy editionDrop", error);
    }
})();