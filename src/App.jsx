import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork  } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk'

const App = () => {
  // Hook from thirdweb
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("Address..", address);

  //initialize the editionDrop contract ERC-1155
  const editionDrop = useEditionDrop("0xBFb3f589f249C7e09495774177Df16d13B438814");

  //this is the ERC-20 contract
  const token = useToken("0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec");

  //this is the governance token
  const vote = useVote("0x8480CC2FA8233c574f228ba5a78F799dcfC5CA6B");

  // state variable to know if user have our NFT 
  const [ userHasNFT, setUserHasNFT ] = useState(false);

  //keeps a loading state while NFT is minting  
  const [ isMinting, setIsMinting ] = useState(false); 

  // holds the amount of token each member has in state
  const [ isMembersAmount, setIsMembersAmount ] = useState([]);

  // holds all members addresses 
  const [ isMembersAddress, setIsMembersAddress ] = useState([]); 

  //a fancy function to shorten users wallet address
  const shortenAddress = (str) => {
     return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
///@notice let users vote on proposal on the dashboard 
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  //retrieve all existing proposals from the contract
  useEffect(() => {
    if(!userHasNFT) {
      return;
    }

    //a call to grab the proposals
    const grabAllProposals = async () => {
      try {
        //grab all proposals that exist on the governance contract then store in state variable to render it later
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("Proposals", proposals);
      } catch (error) {
        console.error("Failed to get proposals", error);
      }
    }
    grabAllProposals();
  }, [userHasNFT, vote]);

  //check if a user has already voted 
  useEffect(() => {
    if (!userHasNFT) {
      return;
    }

    //if it hasn't finished retrieving the proposal from the useEffect above, then it can't check if the user has voted
    if (!proposals.length) {
      return;
    }

    const userHasVoted = async () => {
      try {
        //check if this address has voted on the first proposal
        const hasVoted = await vote.hasVoted(proposals[0].proposalsId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("User has already voted!")
        } else {
          console("User has not voted")
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    }
    userHasVoted();
  }, [userHasNFT, proposals, address, vote]);
  

  ///@notice grab all the addresses of all our NFT holders 
  useEffect(() => {
    if (!userHasNFT){
      return;
    }

    const grabAllAddresses = async () => {
      try {
        // get all the addresses of members who hold an NFT from our ERC-1155 contract 
        const isMembersAddress = await editionDrop.history.getAllClaimerAddresses(0);
        setIsMembersAddress(isMembersAddress);
        console.log("Members addresses..", isMembersAddress);
      } catch (error) {
        console.log("Failed to get members list", error);
      }
    };
    grabAllAddresses();
  }, [userHasNFT, editionDrop.history]);

  ///grabs the # of token each member holds 
  useEffect(() =>{
    if(!userHasNFT){
      return;
    }

    const grabAllBalances = async () =>{
      try {
        // get the token balances of everyone who holds our token on the ERC-20 contract  
        const getALLAmount = await token.history.getAllHolderBalances();
        setIsMembersAmount(getALLAmount);
        console.log("Amount..", getALLAmount); 
      } catch (error) {
        console.log("Failed to get token amount", error); 
      }
    }
    grabAllBalances();
  },[userHasNFT, editionDrop.history]);

  //combine memberAddress and memberAmount into single array
  const holdersList = useMemo(() => {
    return isMembersAddress.map((address) =>{
      /// checking if there is address in the isMembersAmount array.
    // If yes,  return the amount of token the user has.
    // Otherwise, return 0.
     const member = isMembersAmount?.find(({ holder }) => holder === address );
     return {
       address,
       tokenAmount: member?.balance.displayValue || "0",
     }
    });
  }, [isMembersAddress, isMembersAmount]);


  useEffect(() => {
     //if no connected wallet, exit
  if(!address){
    return;
  }
  

const checkBalance = async () => {
  try {
    //check if the user has our NFT 
    const balance = await editionDrop.balanceOf(address, 0);
    if (balance.gt(0)) {
      setUserHasNFT(true);
      console.log("This user has a membership NFT🌟");
    } else {
      setUserHasNFT(false);
      console.log("😭😭This user doesn't have a membership NFT");
    }
  } catch (error) {
    setUserHasNFT(false);
    console.error("Failed to get balance", error);
  }
};
checkBalance();

}, [address, editionDrop]);

//mint the NFT 
const mintNft = async () => {
  try {
    setIsMinting(true);
    //only mint one membership NFT to the user's wallet 
    await editionDrop.claim("0", 1);
    console.log(`Successfully minted an NFT view it on Opensea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
    setUserHasNFT(true);
  } catch (error) {
    setUserHasNFT(false);
    console.error("Failed to mint NFT", error);
  } finally {
     setIsMinting(false);// to stop the loading state
  }
};

if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
  return (
    <div className="unsupported-network">
      <h2>Please connect to Rinkeby</h2>
      <p>This Dapp only works on the Rinkeby network, Please 
        switch networks in your connected wallet
      </p>
    </div>
  )
}

  // if the user has not connected their wallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Hey memer! Welcome to Meme Dao👋 </h1>
        <button onClick={connectWithMetamask} 
        className="btn-hero">Connect wallet
        </button>
      </div>
    );
  }
  //if a user has the membership NFT, view dashboard 
  if (userHasNFT) {
    return (
      <div className="member-page">
        <h1>🍪Dao member page</h1>
        <p>Congratulations on being a member of the Meme Dao community!</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {holdersList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              setIsVoting(true);

              const votes = proposals.map((proposal) => {
                const voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                };
                proposal.votes.forEach(vote => {
                  const elem = document.getElementById(
                    proposal.proposalId + "-" + vote.type
                  );
                  if (elem.checked) {
                    voteResult.vote = vote.type;
                    return;
                  }
                });
                return voteResult;
              });
            
               // first we need to make sure the user delegates their token to vote
               try {
                //we'll check if the wallet still needs to delegate their tokens before they can vote
                const delegation = await token.getDelegationOf(address);
                // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                if (delegation === AddressZero) {
                  //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                  await token.delegateTo(address);
                }
                // then we need to vote on the proposals
                try {
                  await Promise.all(
                    votes.map(async ({ proposalId, vote: _vote }) => {
                      // before voting we first need to check whether the proposal is open for voting
                      // we first need to get the latest state of the proposal
                      const proposal = await vote.get(proposalId);
                      // then we check if the proposal is open for voting (state === 1 means it is open)
                      if (proposal.state === 1) {
                        // if it is open for voting, we'll vote on it
                        return vote.vote(proposalId, _vote);
                      }
                      // if the proposal is not open for voting we just return nothing, letting us continue
                      return;
                    })
                  );

                  try {
                    // if any of the propsals are ready to be executed we'll need to execute them
                    // a proposal is ready to be executed if it is in state 4
                    await Promise.all(
                      votes.map(async ({ proposalId }) => {
                        // we'll first get the latest state of the proposal again, since we may have just voted before
                        const proposal = await vote.get(proposalId);

                        //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                        if (proposal.state === 4) {
                          return vote.execute(proposalId);
                        }
                      })
                    );
                    // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                    setHasVoted(true);
                    // and log out a success message
                    console.log("successfully voted");
                  } catch (err) {
                    console.error("failed to execute votes", err);
                  }
                } catch (err) {
                  console.error("failed to vote", err);
                }
              } catch (err) {
                console.error("failed to delegate tokens");
              } finally {
                // in *either* case we need to set the isVoting state to false to enable the button again
                setIsVoting(false);
              }
            }}
          >
            {proposals.map((proposal) => (
              <div key={proposal.proposalId} className="card">
                <h5>{proposal.description}</h5>
                <div>
                  {proposal.votes.map(({ type, label }) => (
                    <div key={type}>
                      <input
                        type="radio"
                        id={proposal.proposalId + "-" + type}
                        name={proposal.proposalId}
                        value={type}
                        //default the "abstain" vote to checked
                        defaultChecked={type === 2}
                      />
                      <label htmlFor={proposal.proposalId + "-" + type}>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button disabled={isVoting || hasVoted} type="submit">
            {isVoting
              ? "Voting..."
              : hasVoted
                ? "You Already Voted"
                : "Submit Votes"}
          </button>
          {!hasVoted && (
            <small>
              This will trigger multiple transactions that you will need to
              sign.
            </small>
          )}
            </form>
          </div>
        </div>
      </div>
    );
  };
 //render mint NFT screen 
 return (
   <div className="mint-nft">
     <h1>Mint your free meme Dao🍪 NFT </h1>
     <button disabled={isMinting} onClick={mintNft}> 
     {isMinting ? "Minting..." : "Mint your free NFT"}
     </button>
   </div>
 );
 }
  //if the user's wallet is already connected 
  /*return (
    <div className="landing">
      <h1>Hey!👋 Meme DAO👽</h1>
      <p>Wallet connected!</p>
    </div>
  );
};*/


export default App;
