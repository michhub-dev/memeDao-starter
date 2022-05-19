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
        //grab wallet balance. Cos this wallet basically has the entire supply now
        const grabOwnWalletBalance = await token.balanceOf(
         process.env.WALLET_ADDRESS
        );

        //grab 85% of the supply that we hold 
       const supplyValue = grabOwnWalletBalance.displayValue;
       const supplyPercent = Number(supplyValue) / 100 * 85;

       //transfer 85% of the supply to voting contract 
       await token.transfer(
           vote.getAddress(),
           supplyPercent
       );
       console.log("Successfully transfered", supplyPercent, "to vote contract" );
    } catch (err) {
        console.error("Failed to transfer token", err);
    }
})();
