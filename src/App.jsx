import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react'; 


const App = () => {
  // Hook from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Address..", address);

  const editionDrop = useEditionDrop("0xBFb3f589f249C7e09495774177Df16d13B438814");
  // state variable to know if user have our NFT 
  const [ userHasNFT, setUserHasNFT ] = useState(false); 

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

  // if the user has not connected their wallet
  if(!address){
    return (
      <div className="landing">
        <h1>Hey memer! Welcome to Meme Dao👋 </h1>
        <button onClick={connectWithMetamask} className="btn-hero">Connect wallet</button>
      </div>
    );
  }
 
  //if the user's wallet is already connected 
  return (
    <div className="landing">
      <h1>Hey!👋 Meme DAO👽</h1>
      <p>Wallet connected!</p>
    </div>
  );
};


export default App;
