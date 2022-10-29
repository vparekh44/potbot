// require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-toolbox");

// Import and configure dotenv
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.17",
  // paths: {
  //   sources: "./contracts"
  // }
  development: {
    host: "localhost",
    port: 8545,
    network_id: "*" // Match any network id
}
};