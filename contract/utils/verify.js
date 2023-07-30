const { run } = require("hardhat");
const verify = async (contracAddress, args) => {
  console.log("Verifying Contract....");
  try {
    await run("verify:verify", {
      address: contracAddress,
      contructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verify")) {
      console.log("Already Verified");
    } else {
      console.log(error);
    }
  }
};
module.exports = { verify };
