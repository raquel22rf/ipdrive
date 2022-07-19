import { Web3Storage, getFilesFromPath  } from 'web3.storage';

const API_ENDPOINT = new URL("https://api.web3.storage");

const storage = new Web3Storage({ endpoint: API_ENDPOINT, token : process.env.API_TOKEN ? process.env.API_TOKEN : "" })

export const storeFiles = async (input_files_path: any) => {
  const files = [];

  for (const path of input_files_path) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
  return cid
}

export const retrieveFiles = async (cid : string) => {

  const res = await storage.get(cid)
  const files = await res!.files()
 
  for (const file of files) {
    console.log(`${file.cid}: ${file.name} (${file.size} bytes)`)
  }
  
}
