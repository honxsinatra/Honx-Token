const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

network.config.chainId !== 31337
  ? describe.skip
  : describe("HonxToken contract", function () {
      let HonxToken;
      let deployer, address1, address2;
      const totalSupply = 70000000;
      const cap = 100000000;
      const blockReward = 50;
      const sendValue = ethers.parseEther("40000000");
      const sendValue1 = ethers.parseEther("35000000");
      const sendValue2 = ethers.parseEther("5000000");

      beforeEach(async function () {
        const contracts = await deployments.fixture("HonxToken");
        [deployer, address1, address2] = await hre.ethers.getSigners();
        const HonxTokenAddress = contracts["HonxToken"].address;
        HonxToken = await ethers.getContractAt(
          "HonxToken",
          HonxTokenAddress,
          deployer
        );
      });

      describe("constructor", async function () {
        it("Should set the deployer as the owner", async function () {
          const honxTokenOwner = await HonxToken.owner();
          expect(honxTokenOwner).to.equal(deployer.address);
        });

        it("Should mint 70000000 token to the owner", async function () {
          const response = await HonxToken.totalSupply();
          expect(Number(hre.ethers.formatEther(response))).to.equal(
            totalSupply
          );
        });

        it("Should set the max capped total supply correctly", async function () {
          const response = await HonxToken.cap();
          expect(Number(hre.ethers.formatEther(response))).to.equal(cap);
        });

        it("Should set block reward correctly", async function () {
          const response = await HonxToken.blockReward();
          expect(Number(hre.ethers.formatEther(response))).to.equal(
            blockReward
          );
          //assert.equal(response, 50e18);
        });
      });

      describe("transactions", async function () {
        it("Should do transactions and update balances after transactions", async function () {
          const deployerBalance = await HonxToken.balanceOf(deployer);
          await HonxToken.transfer(address1, sendValue);
          const address1Balance = await HonxToken.balanceOf(address1);
          await HonxToken.connect(address1).transfer(address2, sendValue1);
          const address2Balance = await HonxToken.balanceOf(address2);
          const address1FinalBalance = await HonxToken.balanceOf(address1);
          const finalDeployerBalance = await HonxToken.balanceOf(deployer);
          expect(address1Balance).to.equal(sendValue);
          expect(address2Balance).to.equal(sendValue1);
          expect(address1FinalBalance).to.equal(sendValue2);
          expect(finalDeployerBalance).to.equal(deployerBalance - sendValue);
        });
      });

      describe("mintMinerReward", async function () {
        it("Should mint blockreward before every transaction", async function () {
          const response = await HonxToken.totalSupply();
          //console.log(`TotalSupply: ${response}`);
          await HonxToken.transfer(address1, sendValue1);
          const expectedTotalSupply = await HonxToken.totalSupply();
          //console.log(`TotalSupplyAfter: ${expectedTotalSupply}`);
          expect(Number(hre.ethers.formatEther(expectedTotalSupply))).to.equal(
            Number(hre.ethers.formatEther(response)) + blockReward
          );
        });
      });

      describe("setBlockReward", async function () {
        it("Should update block reward", async function () {
          await HonxToken.setBlockReward(60);
          const response = await HonxToken.blockReward();
          /**
           * or could be;
           * assert.equal(Number(hre.ethers.formatEther(response)), 60)
           */
          assert.equal(response, 60e18);
        });
      });
    });
