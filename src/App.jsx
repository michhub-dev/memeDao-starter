import { useAddress, useMetamask, useEditionDrop, useToken } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';


const App = () => {
  // Hook from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Address..", address);

  //initialize the editionDrop contract ERC-1155
  const editionDrop = useEditionDrop("0xBFb3f589f249C7e09495774177Df16d13B438814");
  const token = useToken("0x218D3686d4d45E5ecAaAb8b451a1cF13A93329Ec");
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
  //grab all the addresses of all our NFT holders 
  useEffect(() => {
    if (!userHasNFT){
      return;
    }

    const grabAllAddresses = async () => {
      try {
        const isMembersAddress = await editionDrop.history.getAllClaimerAddresses(0);
        setIsMembersAddress(isMembersAddress);
        console.log("Members addresses..", isMembersAddress);
      } catch (error) {
        console.log("Failed to get members list", error);
      }
    };
    grabAllAddresses();
  }, [userHasNFT, editionDrop.history]);

 

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
