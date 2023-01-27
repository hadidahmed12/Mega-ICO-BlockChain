// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
 
  const WalletAddress = '0x117febdcE99D157a2F065FA05c08aeb7006002cc';
  

  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const erc20token = await ERC20Token.deploy();

  await erc20token.deployed();

  console.log(
    `ERC20 deployed to ${erc20token.address}`
  );


  const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  const airdrop = await Airdrop.deploy(erc20token.address);

  await airdrop.deployed();

  console.log(
    `AirDrop deployed to ${airdrop.address}`
  );



  const Bounty = await hre.ethers.getContractFactory("Bounty");
  const bounty = await Bounty.deploy(erc20token.address);

  await bounty.deployed();

  console.log(
    `Bounty deployed to ${bounty.address}`
  );

  
  const KickstarterContract = await hre.ethers.getContractFactory("KickstarterContract");
  const kickstarterContract = await KickstarterContract.deploy(WalletAddress,erc20token.address);

  await kickstarterContract.deployed();

  console.log(
    `KickStater deployed to ${kickstarterContract.address}`
  );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
