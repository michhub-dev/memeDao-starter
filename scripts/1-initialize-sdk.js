import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

/// import and configure the .env file
import dotenv from "dotenv";
dotenv.config();

/// ensure .env is working 
if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY ==="") {
    console.log("Private key not found")
}
if(!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS ==="") {
    console.log("Wallet address not found")
}
if(!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL ==="") {
    console.log("Alchemy api key not found")
}

///use ALCHEMY_API_URL from .env 
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);


(async () => {
    try {
      const address = await sdk.getSigner().getAddress();
       console.log("sdk initialized by address..", address);

    } catch (err) {
        console.error("Failed to get apps from the sdk", err);
        process.exit(1);
      }
})();
export default sdk;