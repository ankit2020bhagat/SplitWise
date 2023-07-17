SplitWise Contract
SplitWise is a Solidity smart contract that facilitates the splitting of expenses among multiple contributors. It allows contributors to add expenses, make payments, and keep track of their owed and lent amounts.

Features
Add contributors with verified status
Add expenses with a purpose, amount, vendor, and payer
Split expenses among contributors and update owed and lent amounts
Make payments to settle outstanding balances
Retrieve contributor details including owed and lent amounts
Prerequisites
Solidity version 0.8.18
OpenZeppelin Contracts library (access, utils, security)
Usage
Deploy the SplitWise contract to an Ethereum network of your choice.
Set up the default admin role for managing contributor access.
Add contributors using the addContributors function, specifying the user's address and name. This function can only be called by the contract's admin.
Contributors can add expenses using the addExpenses function, providing the purpose, amount, vendor address, and an array of contributor addresses involved in the expense. Payments are split equally among the contributors, and the owed and lent amounts are updated accordingly.
Contributors can make payments using the makePayment function, which transfers the owed amount to the respective contributors. The payment amount should cover the total owed amount.
Contributor details, including owed and lent amounts, can be retrieved using the getDetails function.
Security Considerations
The contract utilizes role-based access control to manage contributor access. Only the contract's admin can add contributors and perform administrative functions.
The contract uses the ReentrancyGuard modifier to protect against reentrancy attacks.
License
This project is licensed under the MIT License - see the LICENSE file for details.
