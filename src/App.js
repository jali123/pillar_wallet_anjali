import "./styles.css";
import { useState } from "react";
import { ethers } from "ethers";
import { Sdk, randomPrivateKey } from "etherspot";

export default function App() {
  const [ether, setEther] = useState(0); // ETH value to be sent
  const [address, setAddress] = useState(""); // recipient address which will receive specific ETH balance
  const [accBalance, setBalance] = useState("1"); // my ETH balance

  const getBalance = async () => {
    try {
      const PRIVATE_KEY = randomPrivateKey(); // generating random key
      const sdk = new Sdk(PRIVATE_KEY); // creating sdk instance
      sdk.notifications$.subscribe((notification) =>
        console.log("notification:", notification)
      ); // subscribing for access to account details
      await sdk.computeContractAccount(); // awaiting for account details
      const { account } = sdk.state; // destructuring details
      const provider = new ethers.providers.JsonRpcProvider(); // provider instance for connecting to ethereum network
      const balance = await provider.getBalance(account.address); // get balance of an ETH address
      const formattedBalance = ethers.utils.formatEther(balance); // formatting balance
      setBalance(formattedBalance);
    } catch (error) {
      console.log(error); // error logging
    }
  };

  const sendEther = () => {
    const provider = new ethers.providers.JsonRpcProvider(); // provider instance for connecting to ethereum network
    const signer = provider.getSigner(); // signer for authorizing operations
    signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(ether.toString())
    }); // sending specific ether balance to recipient ETH address
  };

  return (
    <div className="App">
      <label>Ether:</label>
      <input
        type="number"
        value={ether}
        onChange={(e) => setEther(e.target.value)}
      />
      <br />
      <label>Address:</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <button onClick={() => sendEther()}>Transfer ether</button>
      <br />
      <div>{`Ether balance: ${accBalance}`}</div>
      <button onClick={() => getBalance()}>Get balance</button>
    </div>
  );
}
