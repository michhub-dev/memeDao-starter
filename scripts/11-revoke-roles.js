import sdk from "./1-initialize-sdk.js";
///@notice remove admin powers and handle basic errors 


const token = sdk.getToken("0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec");

(async () => {
    try {
        // log current role
        const currentRoles = await token.roles.getAll();
        console.log("Current roles", currentRoles); 
       
        //revoke all the superpowers my wallet has over the ERC-20 contract 
        await token.roles.setAll({ admin: [], minter: []});
        console.log("🎉 Roles after revoking myself", await token.roles.getAll());

        console.log("🎉 Successfully revoked myself from the ERC-20 contract");

    } catch (error) {
        console.error("Failed to revoke myself from the DAO treasury", error); 
    };
})();