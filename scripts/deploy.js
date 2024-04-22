import { ethers } from "ethers";

import Escrow from "../src/artifacts/contracts/Escrow.sol/Escrow.json";

export default async function deploy(signer, broker, beneficiary, value) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );

  return factory.deploy(broker, beneficiary, { value });
}
