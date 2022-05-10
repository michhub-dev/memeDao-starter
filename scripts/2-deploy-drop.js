import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try{
        const EditionDropInfo = await sdk.deployer.deployEditionDrop({
            //the collection's info 
            name: "Meme Dao",
            description: "My Meme Dao",
            image: readFileSync("scripts/assets/image.png"),
            primary_sale_recipient: AddressZero, 
        });
    }
})