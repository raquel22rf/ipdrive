import LitJsSdk from 'lit-js-sdk'

const client = new LitJsSdk.LitNodeClient()
const chain = 'polygon'
const standardContractType = 'ERC721'

class Lit {
  private litNodeClient: any

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }

  async encrypt(file: File | Blob) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file: file })
    const accessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '0',  // 0.000001 ETH
        },
        chain: 'polygon',
      },
    ];

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    })
    console.log('[DEBUG ENCRYPT]', encryptedSymmetricKey)

    return {
      encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    }
  }

  async decrypt(encryptedFile: any, encryptedSymmetricKey: string) {
    if (!this.litNodeClient) {
      await this.connect()
    }
    const accessControlConditions = [
      {
        chain: 'polygon',
        contractAddress: '',
        standardContractType: '',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '0',  // 0.000001 ETH
        },
      },
    ];
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    console.log('[DEBUG DECRYPT]', encryptedSymmetricKey, authSig)

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig
    })

    console.log('parametros', encryptedFile, symmetricKey)
    const decryptedFile = await LitJsSdk.decryptFile({
      symmetricKey: symmetricKey,
      file: encryptedFile,
    });

    console.log('resposta', decryptedFile)

    return { decryptedFile }
  }
}

export default new Lit()

