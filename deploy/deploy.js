const { verify } = require("../utils/verify");
const { getNamedAccounts, deployments, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const HonxToken = await deploy("HonxToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await verify(HonxToken.address, []);
  }
  log("_________________________________________________________________");
};
module.exports.tags = ["HonxToken"];
