const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SpltiWise contract", function () {
  let splitWise, accounts;
  it("", async function () {
    [...accounts] = await ethers.getSigners();
    splitWise = await ethers.deployContract("SplitWise", []);
    await splitWise.waitForDeployment();
    console.log("Contract Deployed at ", splitWise.target);
  });
  it("only admin account can add contributor", async function () {
    await splitWise.addContributors(accounts[1].address, "ankit");
    await splitWise.addContributors(accounts[2].address, "kumar");
    await splitWise.addContributors(accounts[3].address, "bhagat");
  });

  it("only contributor  can add expenses", async function () {
    let txn = await splitWise
      .connect(accounts[1])
      .addExpenses(
        "coffee",
        500,
        [accounts[2].address, accounts[3].address],
        accounts[10].address,
        { value: 500 }
      );
    const contributor = await splitWise.expenses(0);
    console.log(contributor);
    txn = await splitWise
      .connect(accounts[2])
      .addExpenses(
        "coffee",
        200,
        [accounts[1].address, accounts[3].address],
        accounts[10].address,
        { value: 200 }
      );
  });
  it("get all Deatials", async function () {
    const owelend = await splitWise.connect(accounts[1]).getDetails();
    console.log("owe and lend ", owelend.toString());
  });

  it("Make Payment", async function () {
    const txn = await splitWise
      .connect(accounts[3])
      .makePayment({ value: 232 });
    await txn.wait();
    const owelend = await splitWise.connect(accounts[3]).getDetails();
    console.log("owe and lend ", owelend.toString());
  });
});
