import sdk from "./1-initialize-sdk.js";
/// deploy vote

(async () =>{
    try {
        ///this will deploy a brand new voting contract 
     const voteGovContract = await sdk.deployer.deployVote({
         //governanace contract name 
         name: "Meme Governance Dao",
         // location of the governance token, the ERC-20 token 
         voting_token_address: "0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec",
         // when members can start voting 
         voting_delay_in_blocks: 0,
         //how long members have to vote on a proposal when it's created, 1 day = 6570 blocks
         voting_period_in_blocks: 6570,
         //The minimum % of the total supply that need to vote for
      // the proposal to be valid after the time for the proposal has ended
         voting_quorum_fraction: 0,
         //minimum # of token a user needs to be allowed to create a proposal 
         proposal_token_threshold: 0,
     });
     console.log("Successfully deployed vote contract, address", voteGovContract);
    } catch (err) {
        console.error("Failed to deploy the vote contract", err);
    }
})();