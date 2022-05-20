import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";
//import { Description } from "@ethersproject/properties";
//import { getAddress } from "ethers/lib/utils";

//Let users vote on proposal

// this is the governance token
const vote = sdk.getVote("0x8480CC2FA8233c574f228ba5a78F799dcfC5CA6B");
//this is the ERC-20 contract 
const token = sdk.getToken("0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec");

(async () => {
    // create proposal to mint 420, 000 token to the treasury
    try {
        const amount = 420_000;
        const  description = "Should the DAO mint additional " + amount + "token into the treasury?";
        const executions = [
            {
                //token contract that acqually execute the mint
                toAddress: token.getAddress(),
                //amount of eth to send in this proposal 
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    "mintTo", [
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
            }
        ];
        await vote.propose(description, executions);
        console.log("Successfully created proposal to mint token");
    } catch (err) {
        console.error("Failed to create first proposal", err);
        process.exit(1);
    }

    try {
        /// transfering 5,200 token to myself for being awesome
        const amount = 5_200;
        const description = "Should the DAO transfer" + amount + " token from the treasury into my" + process.env.WALLET.ADDRESS + "wallet for being awesome?";
        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    //a transfer from the treasury to my wallet
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: token.getAddress(),
            },
        ];
         await vote.propose(description, executions);

         console.log("Successfully created a proposal to reward myself from the treasury, hopefully people vote for it");
    } catch (error) {
        console.error("Failed to create the second proposal", error);
    }
})();