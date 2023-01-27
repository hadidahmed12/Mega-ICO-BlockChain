import { expect } from "chai";
import { Contract, constants } from "ethers";
import { deployContract, solidity } from "ethereum-waffle";

describe("Airdrop contract tests", () => {
    let provider;
    let wallet;
    let airdrop;
    let token;

    beforeEach(async () => {
        // Set up provider and wallet
        provider = waffle.provider;
        wallet = provider.getSigner(0);

        // Deploy an ERC20 token for use in the airdrop
        token = await deployContract(wallet, ERC20);

        // Deploy the airdrop contract, passing in the token address
        airdrop = await deployContract(wallet, Airdrop, [token.address]);

        // Set the total supply of the token to 1000
        await token.functions.mint(wallet.address, 1000);
    });

    it("should allow registration of valid addresses", async () => {
        // Create a new address to register
        const user = provider.getSigner(1);
        await token.functions.transfer(user.address, 100);
        // Register the new address
        await airdrop.functions.registration(user.address);

        // Get the registered users from the contract
        const registeredUsers = await airdrop.functions.RegisteredUsers();

        // Check that the registered address is in the list
        expect(registeredUsers).to.include(user.address);
    });

    it("should not allow registration of the contract owner's address", async () => {
        // Try to register the contract owner's address
        await expect(airdrop.functions.registration(wallet.address)).to.be.rejectedWith(
            "Airdrop: Owner cannot participate on Airdrop!"
        );
    });

    it("should not allow registration of address(0)", async () => {
        // Try to register address(0)
        await expect(airdrop.functions.registration(constants.AddressZero)).to.be.rejectedWith(
            "Airdrop: Invalid address"
        );
    });

    it("should not allow registration with less than 1 token", async () => {
        // Create a new address to register
        const user = provider.getSigner(1);
        // Try to register the new address with less than 1 token
        await expect(airdrop.functions.registration(user.address)).to.be.rejectedWith(
            "AirDrop: Insufficient Balance!"
        );
    });

    it("should not allow registration of the same address multiple times", async () => {
        // Create a new address to register
        const user = provider.getSigner(1);
        await token.functions.transfer(user.address, 100);

        // Register the new address
        await airdrop.functions.registration(user.address);

        // Try to register the same address again
        await expect(airdrop.functions.registration(user.address)).to.be.rejectedWith(
            "AirDrop: Participant is already registered!"
        );
    });
    it("should correctly drop tokens to registered users", async () => {
        // Create a new address to register
        const user1 = provider.getSigner(1);
        const user2 = provider.getSigner(2);
        const user3 = provider.getSigner(3);
        await token.functions.transfer(user1.address, 100);
        await token.functions.transfer(user2.address, 100);
        await token.functions.transfer(user3.address, 100);
        // Register the new address
        await airdrop.functions.registration(user1.address);
        await airdrop.functions.registration(user2.address);
        await airdrop.functions.registration(user3.address);
        const initialBalance1 = await token.functions.balanceOf(user1.address);
        const initialBalance2 = await token.functions.balanceOf(user2.address);
        const initialBalance3 = await token.functions.balanceOf(user3.address);
        //drop the tokens
        await airdrop.functions.dropTokens(5);
        const finalBalance1 = await token.functions.balanceOf(user1.address);
        const finalBalance2 = await token.functions.balanceOf(user2.address);
        const finalBalance3 = await token.functions.balanceOf(user3.address);
        // Check that the correct number of tokens were distributed
        expect(finalBalance1.toNumber()).to.equal(initialBalance1.toNumber()+5);
        expect(finalBalance2.toNumber()).to.equal(initialBalance2.toNumber()+5);
        expect(finalBalance3.toNumber()).to.equal(initialBalance3.toNumber()+5);
    });

    it("should correctly set opening and closing time", async () => {
        let openingTime = await provider.getBlockNumber();
        let closingTime = openingTime+100;
        //set the opening and closing time for airdrop
        await airdrop.functions.airdropTiming(openingTime,closingTime);
        const _openingTime = await airdrop.functions.airdropOpeningTime();
        const _closingTime = await airdrop.functions.airdropClosingTime();
        // Check that the correct opening and closing time are set
        expect(_openingTime.toNumber()).to.equal(openingTime);
        expect(_closingTime.toNumber()).to.equal(closingTime);
    });



});
