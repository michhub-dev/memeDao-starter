import { useAddress, useMetamask } from '@thirdweb-dev/react';


const App = () => {
  // Hook from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Address..", address);

  // if the user has not connected their wallet
  if(!address){
    return (
      <div className="landing">
        <h1>Hi! Welcome to Meme Dao👋 </h1>
        <button onClick={connectWithMetamask} className="btn-hero">Connect wallet</button>
      </div>
    );
  }
  //if the user's wallet is already connected 
  return (
    <div className="landing">
      <h1>Hi!👋 Meme DAO👽</h1>
      <p>Wallet connected!</p>
    </div>
  );
};

export default App;
