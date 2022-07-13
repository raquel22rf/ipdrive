import { ethers, } from "ethers";
import ERC20ABI from "./ERC20.json";

export const connectWallet = async () => {
	if (window.ethereum) {
		const account = await window.ethereum.request({ method: "eth_accounts" });
		if (account.length == 0) {
			await window.ethereum.request({
				method: "eth_requestAccounts",
			});
		}     
	}
};

export const checkIfUserIsConnected = async () => {
    if (window.ethereum) {
        const account = await window.ethereum.request({ method: "eth_accounts" });
        if (account.length == 0) {
          return false;
        } else {
          return true;
        }       
    }
    return false;
}

export const getUserAddress = async () => {
    var result;
    if (window.ethereum) {
        const account = await window.ethereum.request({ method: "eth_accounts" });
        if (account.length != 0) {
            result = account[0]
        }      
    }
    return result;
}

export const getUserBalance = async () => {
    const account = await window.ethereum.request({ method: "eth_accounts" });
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    const MATIC_ADDRESS = "0x0000000000000000000000000000000000001010";
    const MATIC = new ethers.Contract(MATIC_ADDRESS, ERC20ABI, provider);
    const balance = await MATIC.balanceOf(account[0]);

    return ethers.utils.formatEther(balance);
}

export const checkChain =async () => {
    var isCorrect = false;
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork()
    if (chainId == 80001) isCorrect = true;
    return isCorrect;
}