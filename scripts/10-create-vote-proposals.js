import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";
import { Description } from "@ethersproject/properties";
import { getAddress } from "ethers/lib/utils";

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
    }
})