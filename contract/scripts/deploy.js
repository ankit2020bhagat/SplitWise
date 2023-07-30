const hre = require("hardhat");
const { verify } = require("../utils/verify");
async function main() {
  const splitWise = await hre.ethers.deployContract("SplitWise", []);
  await splitWise.waitForDeployment();
  console.log("Contract Deployed at", splitWise.target);
  await splitWise.deploymentTransaction().wait(5);
  await verify(splitWise.target, []);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
