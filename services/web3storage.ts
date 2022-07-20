import { Web3Storage } from 'web3.storage';

const API_ENDPOINT = new URL("https://api.web3.storage");
const storage = new Web3Storage({ endpoint: API_ENDPOINT, token : process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY ? process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY : "" });

export const storeFiles = async (file: any) => {
  const cid = await storage.put([file], { name: file.name });
  console.log('Content added with CID:', cid);
  return cid;
}

export const retrieveFile = async (cid : string) => {
  const res = await storage.get(cid);
  const files = await res!.files();

	return files[0];
}
