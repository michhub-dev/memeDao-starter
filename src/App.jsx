import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';


const App = () => {
  // Hook from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Address..", address);

  //initialize the editionDrop contract 
  const editionDrop = useEditionDrop("0xBFb3f589f249C7e09495774177Df16d13B438814");
  // state variable to know if user have our NFT 
  const [ userHasNFT, setUserHasNFT ] = useState(false);
  //keeps a loading state while NFT is minting  
  const [ isMinting, setIsMinting ] = useState(false); 

  useEffect(() => {
     //if no connected wallet, exit
  if(!address){
    return;
  }
  

const checkBalance = async () => {
  try{
    //check if the user has our NFT 
    const balance = await editionDrop.balanceOf(address, 0);
    if(balance.gt(0)){
      setUserHasNFT(true);
      console.log("This user has a membership NFT🌟");
    } else{
      console.log("😭😭This user doesn't have a membership NFT");
    }
  }catch(error){
    setUserHasNFT(false)
    console.log("Failed to get balance",error)
  }
}
checkBalance();

}, [address, editionDrop]);

const mintNft = async () => {
  try{
    setIsMinting(true);
    await editionDrop.claim("0", 1);
    console.log(`Successfully minted an NFT view it on Opensea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
    setUserHasNFT(true);
  } catch(error){
    setUserHasNFT(false);
    console.error("Failed to mint NFT", error);
  } finally{
     setIsMinting(false);
  };
};

  // if the user has not connected their wallet
  if(!address){
    return (
      <div className="landing">
        <h1>Hey memer! Welcome to Meme Dao👋 </h1>
        <button onClick={connectWithMetamask} className="btn-hero">Connect wallet</button>
      </div>
    );
  }
 //render mint NFT screen 
 return(
   <div className="mint-nft">
     <h1>Mint your free meme Dao🍪 NFT </h1>
     <button disabled={isMinting} onClick={mintNft}> {isMinting ? "Minting..." : "Mint your free NFT"}</button>
   </div>
 )

  //if the user's wallet is already connected 
  return (
    <div className="landing">
      <h1>Hey!👋 Meme DAO👽</h1>
      <p>Wallet connected!</p>
    </div>
  );
};


export default App;
