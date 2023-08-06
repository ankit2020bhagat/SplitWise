import React from "react";
import { useEffect, useState } from "react";
import "./styles/App.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./constant/constant";
import splitwise from "./artifacts/contracts/SplitWise.sol/SplitWise.json";
const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const [userAddress, setUserAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [contributors, setContributors] = useState("");
  const [lend, setLend] = useState("");
  const [borrow, setBorrow] = useState("");
  const [vendor, setVendor] = useState("");
  const [totalLend, setTotalLend] = useState("");
  const [totalBorrow, setTotalBorrow] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const addContributors = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          splitwise.abi,
          signer
        );
        console.log(userAddress, userName);
        const txn = await contract.addContributors(userAddress, userName);
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = () => {
    const valuesArray = contributors.split(",")?.map((item) => item.trim());
?.
    return valuesArray;
  };

  function convertTo2DArray(arr, rows, cols) {
    if (arr.length !== rows * cols) {
      throw new Error("Array length should be equal to rows * cols.");
    }

    const resultArray = [];
    let index = 0;

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(arr[index]);
        index++;
      }
      resultArray.push(row);
    }

    return resultArray;
  }

  const addExpenses = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const value = handleSubmit();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          splitwise.abi,
          signer
        );
        console.log(value);
        const txn = await contract.addExpenses(purpose, amount, value, vendor, {
          value: amount,
        });
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const makePayment = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          splitwise.abi,
          signer
        );
        getDetials();

        const txn = await contract.makePayment({ value: totalBorrow });
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function printArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length - 1; j++) {
        console.log(arr[i][0]);
        let lend = parseInt(arr[i][j]);
        if (lend > 0) {
          console.log(lend);
          setLend(lend);
        }
        let borrow = parseInt(arr[i][j + 1]);
        if (borrow > 0) {
          console.log(borrow);
          setBorrow(borrow);
        }
      }
    }
  }

  const getDetials = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          splitwise.abi,
          signer
        );
        const [contributor, lend, borrow] = await contract.getDetails();
        const delimiter = ",";

        const result_array = contributor.toString().split(delimiter);
        const twoDArray = convertTo2DArray(result_array, 2, 4);
        printArray(twoDArray);
        console.log("Lend", lend.toString(), "Borrow", borrow.toString());
        setTotalLend(lend.toString());
        setTotalBorrow(borrow.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <div className="button-container">
            <input
              type="text"
              placeholder="User Address"
              onChange={(e) => setUserAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="User Name"
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className="cta-button mint-button"
              disabled={null}
              onClick={addContributors}
            >
              Add_Contributor
            </button>
            <input
              type="text"
              placeholder="Purpose"
              onChange={(e) => setPurpose(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contributors"
              onChange={(e) => setContributors(e.target.value)}
            />
            <input
              type="text"
              placeholder="vendor"
              onChange={(e) => setVendor(e.target.value)}
            />
            <button
              className="cta-button mint-button"
              disabled={null}
              onClick={addExpenses}
            >
              Add_Expenses
            </button>
            <button
              className="cta-button mint-button"
              disabled={null}
              onClick={makePayment}
            >
              Make_Payment
            </button>
            <br />
          </div>
        </div>

        <div className="button-container"></div>
      </div>
    );
  };

  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja donut gif"
      />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Decentralized SplitWise </p>
              <p className="subtitle">Split Your Bill with contributor</p>
            </div>
            <button
              onClick={getDetials}
              className="cta-button connect-wallet-button"
            >
              Get_Detials
            </button>
          </header>
          <h2></h2>
          <h2>You are owed {totalLend} Wei Overall</h2>
          <h2>You are Borrowed {totalBorrow} Wei Overall</h2>
        </div>
        {!currentAccount && renderNotConnectedContainer()}
        {/* Render the input form if an account is connected */}
        {currentAccount && renderInputForm()}
      </div>
    </div>
  );
};

export default App;
