import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "../scripts/deploy";
import Escrow from "./components/Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function deleteContract(escrowContract, signer) {
  const deleteTxn = await escrowContract.connect(signer).deleteContract();
  await deleteTxn.wait();
}

export async function setTimelock(escrowContract, signer, timelock) {
  const setTimelockTxn = await escrowContract
    .connect(signer)
    .setTimelock(timelock);
  await setTimelockTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }
    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const broker = document.getElementById("broker").value;
    const value = ethers.BigNumber.from(document.getElementById("wei").value);
    const timelockSeconds = parseInt(document.getElementById("timelock").value);
    const timelockTimestamp = Math.floor(Date.now() / 1000) + timelockSeconds;
    const escrowContract = await deploy(signer, broker, beneficiary, value);
    await setTimelock(escrowContract, signer, timelockTimestamp);
    const escrow = {
      address: escrowContract.address,
      broker,
      beneficiary,
      value: value.toString(),
      timelock: timelockTimestamp,
      handleApprove: async () => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (currentTimestamp >= timelockTimestamp) {
          escrowContract.on("Approved", () => {
            const element = document.getElementById(escrowContract.address);
            if (element) {
              element.className = "complete";
              element.innerText = "✅ Fund transfer approved";
            }
          });
          await approve(escrowContract, signer);
        } else {
          alert("Timelock period has not elapsed yet.");
        }
      },
      handleDelete: async () => {
        await deleteContract(escrowContract, signer);
        setEscrows(escrows.filter((item) => item.address !== escrow.address));
      },
    };
    setEscrows([...escrows, escrow]);
  }
  return (
    <>
      <div className="contract">
        <h1> Create Escrow Contract </h1>
        <label>
          Broker
          <input type="text" id="broker" placeholder="Enter Broker Address" />
        </label>
        <label>
          Fund Beneficiary
          <input
            type="text"
            id="beneficiary"
            placeholder="Enter Beneficiary Address"
          />
        </label>
        <label>
          Fund Amount
          <input type="text" id="wei" placeholder="Enter Amount (in wei)" />
        </label>
        <label>
          Timelock Duration (in seconds)
          <input
            type="text"
            id="timelock"
            placeholder="Enter Timelock Duration"
          />
        </label>
        <div
          className="button"
          id="deploy"
          onClick={(event) => {
            event.preventDefault();
            newContract();
          }}
        >
          Deploy New Contract
        </div>
      </div>
      <div className="existing-contracts">
        <h1>Escrow Contracts</h1>
        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}
export default App;
