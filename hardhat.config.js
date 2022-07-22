require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

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
  defaultNetwork: "localhost",
  networks: {
    localhost: {
			url: "http://localhost:7545",
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
    },
		mumbai: {
			url: "https://rpc-mumbai.maticvigil.com/v1/cbf49a46f64f11243f0d05507ecb0be9484fdcb6",
      accounts: [`119d550edc42901cb690c0a0966d5a42dc430c975f2059a815a3633dd1921db0`]
		}
  },
  solidity: {
    compilers: [
      { version: "0.8.4" },
    ]
  },
	paths: {
		artifacts: "artifacts"
	},
	etherscan: {
		apiKey: {
			polygonMumbai: ""
		}
	}
};
