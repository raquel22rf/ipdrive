import { ethers } from "ethers";

export const connectWallet = async () => {
	let accounts = null;
	if(typeof window !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		accounts = await provider.send("eth_requestAccounts", []);
	}

	return accounts;
}