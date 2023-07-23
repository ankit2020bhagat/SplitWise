const hre = require("hardhat");

async function main() {
  const splitWise = await hre.ethers.deployContract("SplitWise", []);
  await splitWise.waitForDeployment();
  console.log("Contract Deployed at", splitWise.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
