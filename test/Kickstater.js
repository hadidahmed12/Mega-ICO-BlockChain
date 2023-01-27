import { expect } from "chai";
import { ethers } from "hardhat";
import { solidity } from "hardhat/solidity";
import { Contract, Wallet } from "ethers";

describe("KickstarterContract", () => {
  let contract;
  let wallet;
  let other;

  before(async () => {
    [wallet, other] = await ethers.getSigners();
    contract = await solidity.deploy("KickstarterContract", [wallet.address, ERC20Token], {
      signer: wallet
    });
  });

  it("Should have a minimum investment cap of 5 wei", async () => {
    const minCap = await contract.investorMinCap();
    expect(minCap.toString()).to.equal("5");
  });

  it("Should have a maximum investment cap of 5 ether", async () => {
    const maxCap = await contract.investorHardCap();
    expect(maxCap.toString()).to.equal("5000000000000000000");
  });

  it("Should allow user to contribute up to the maximum investment cap", async () => {
    await contract.buy(other.address, { value: ethers.utils.parseEther("5") });
    const contribution = await contract.getUserContribution(other.address);
    expect(contribution.toString()).to.equal("5000000000000000000");
  });

  it("Should not allow user to contribute more than the maximum investment cap", async () => {
    try {
      await contract.buy(other.address, { value: ethers.utils.parseEther("0.1") });
    } catch (error) {
      expect(error.message).to.equal("OverFlow Amount: Investment should be equal or less than the investorHardCap");
    }
  });

  it("Should not allow user to contribute less than the minimum investment cap", async () => {
    try {
      await contract.buy(other.address, { value: ethers.utils.parseWei("4") });
    } catch (error) {
      expect(error.message).to.equal("UnderFlow Amount: Investment should be equal or greater than the investorMinCap");
    }
  });

  it("Should have a goal of 20 ether", async () => {
    const goal = await contract.goalToken();
    expect(goal.toString()).to.equal("20000000000000000000");
  });

  it("Should have a cap of 60 ether", async () => {
    const cap = await contract.capToken();
    expect(cap.toString()).to.equal("60000000000000000000");
  });

  it("Should successfully forward funds to the wallet", async () => {
    const initialBalance = await wallet.getBalance();
    await contract.buy(other.address, { value: ethers.utils.parseEther("5") });
    await contract.finalize();
    const finalBalance = await wallet.getBalance();
    expect(finalBalance.sub(initialBalance).toString()).to.equal("5000000000000000000");
  });

});
