const { ethers } = require("ethers");

const main = async () => {
    let contractFactory = await hre.ethers.getContractFactory('IPDrive');
    let contract = await contractFactory.deploy(ethers.utils.parseEther('0.001'));
    await contract.deployed();
    console.log("Contract deployed to %s", contract.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

}

runMain()