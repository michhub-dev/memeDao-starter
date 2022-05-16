import sdk from "./1-initialize-sdk.js";
/// Create token supply
///addres of the ERC-20 token printed
const token = sdk.getToken("0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec");

(async () => {
    try{
    //max token supply
   const amount = 2000000;
   //interact with the deployed ERC-20 and mint it
   await token.mint(amount); 
   const totalSupply = await token.totalSupply();

   console.log("There is now", totalSupply.displayValue, "$MDT in circulation");
    }catch (error) {
        console.log("Failed to print money", error);
    }
})();