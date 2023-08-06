SplitWise Smart Contract
The SplitWise Smart Contract is a decentralized application (DApp) built on the Ethereum blockchain. It provides a smart way to split expenses among contributors and settle outstanding balances in a secure and transparent manner.

Table of Contents
Introduction
Features
Requirements
Usage
Contract Deployment
Contributing
License
Introduction
The SplitWise Smart Contract allows contributors to add expenses and split them among other verified contributors. Each contributor can settle their outstanding balances by making payments to others. The contract ensures that only verified contributors can add expenses and make payments, and it handles the settlement of expenses automatically.

Features
Role-based access control using OpenZeppelin's AccessControl library.
Contributors can be added by the contract's admin with verified status.
Verified contributors can add expenses, split them among other contributors, and make payments to settle their outstanding balances.
Detailed contributor information, including lending and borrowing amounts, can be retrieved.
Built-in protection against reentrancy attacks using OpenZeppelin's ReentrancyGuard.
Transactions are handled transparently on the Ethereum blockchain.
Requirements
Node.js (v12 or higher)
Hardhat (v2.0 or higher)
Solidity (v0.8.19 or compatible)
OpenZeppelin Contracts (v4.0.0 or compatible)
Usage
To use the SplitWise Smart Contract, follow these steps:

Install the required dependencies:

Copy code
npm install
Compile the smart contract:

python
Copy code
npx hardhat compile
Run the tests to ensure everything works correctly:

bash
Copy code
npx hardhat test
Deploy the contract to an Ethereum network of your choice (testnet or mainnet).

Interact with the contract using a compatible Ethereum wallet or DApp browser.
Contributing
Contributions to the SplitWise Smart Contract are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request.

License
The SplitWise Smart Contract is licensed under the MIT License. See LICENSE for more information.
