/**
* @type import('hardhat/config').HardhatUserConfig
*/

// hardhat.config.js

require('dotenv').config();
 

const { API_URL, PRIVATE_KEY,API_KEY } = process.env;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "goerli",
  networks: {
      hardhat: {} ,
      goerli: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: API_KEY,
  }
};