const { expect } = require('chai');
const { ethers } = require('hardhat');
const Token = require('path/to/token-contract');
const Bounty = require('path/to/bounty-contract');

describe('Bounty Contract', () => {
  let token;
  let bounty;
  let owner;
  let recipient;
  
  before(async () => {
    // Deploy the token contract
    token = await Token.new();

    // Deploy the bounty contract
    bounty = await Bounty.new(token.address);

    // Get the contract owner
    owner = await bounty.owner();

    // Create a recipient address
    recipient = await ethers.getSigners()[1].getAddress();
  });
  
  it('should return the correct bounty token distribution', async () => {
    // Set the total supply of the token
    await token.mint(owner, ethers.utils.parseEther('100'));

    // Calculate the expected bounty token distribution
    const expectedBountyAllocation = ethers.utils.parseEther('10').div(ethers.utils.parseEther('100'));

    // Get the actual bounty token distribution
    const actualBountyAllocation = await bounty.bountyAllocation();

    // Compare the expected and actual results
    expect(actualBountyAllocation).to.equal(expectedBountyAllocation);
  });
  
  it('should allow the owner to distribute tokens as a reward', async () => {
    // Set the initial balance of the recipient
    const initialBalance = await token.balanceOf(recipient);

    // Distribute tokens as a reward
    await bounty.bountyReward(recipient, ethers.utils.parseEther('1'));

    // Get the updated balance of the recipient
    const updatedBalance = await token.balanceOf(recipient);

    // Compare the initial and updated balances
    expect(updatedBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther('1'));
  });
  
  it('should not allow the owner to distribute tokens as a reward to the contract owner', async () => {
    // Try to distribute tokens as a reward to the contract owner
    await expect(bounty.bountyReward(owner, ethers.utils.parseEther('1'))).to.be.rejected;
  });
  
  it('should not allow the owner to distribute tokens as a reward to address(0)', async () => {
    // Try to distribute tokens as a reward to address(0)
    await expect(bounty.bountyReward(ethers.constants.AddressZero, ethers.utils.parseEther('1'))).to.be.rejected;
  });
  
  it('should not allow the owner to distribute tokens as a reward beyond the allocated bounty tokens', async () => {
    // Distribute tokens as a reward
    await bounty.bountyReward(recipient, ethers.utils.parseEther('9'));
  
    // Try to distribute more tokens as a reward
    await expect(bounty.bountyReward(recipient, ethers.utils.parseEther('1'))).to.be.rejected;
    });
  });