import sdk from "./1-initialize-sdk.js";
///@notice Setting up community treasury

// this is the governance contract 
const vote =  sdk.getVote("0x8480CC2FA8233c574f228ba5a78F799dcfC5CA6B"); 
// this is  the ERC-20 contract
const token =  sdk.getToken("0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec");

(async () => {
    try {
        //give the treasury the power to mint additional token if needed 
        await token.roles.grant("minter", vote.getAddress());

        console.log("Successfully gave vote contract permissions to act on token contract");
    } catch (err) {
        console.error("Failed to grant vote contract permissions on token contract", err);
        process.exit(1);
    }
    try {
        
    }
})
