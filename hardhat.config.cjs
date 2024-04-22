require("@nomiclabs/hardhat-ethers")
 
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    fuji: {
      url: "https://quaint-green-cherry.avalanche-testnet.quiknode.pro/61620aa241785ec33ddaebbfe8ffe2e801732308/ext/bc/C/rpc/",
      accounts: ["0x91e2cffc14c2509ddaa56a391dcf9377c5ceacb8d9acd3eb00a9229b80e64072"],
      chainId: 43113,
    },
  },
}