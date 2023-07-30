const { verify } = require("../utils/verify");
const { network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const splitWise = await deploy("SplitWise", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("Contract deployed at :", splitWise.address);
};

module.exports.tags = ["SplitWise"];
