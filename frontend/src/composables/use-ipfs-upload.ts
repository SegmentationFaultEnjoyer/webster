import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'
import { config } from '@/config'

export enum HOSTS {
  infura = 'ipfs.infura.io',
  pinata = 'api.pinata.cloud',
}

const INFURA_PORT = 5001
// const PINATA_PORT = 443

const infuraAuth =
  'Basic ' +
  Buffer.from(config.INFURA_PROJECT_ID + ':' + config.INFURA_API_KEY).toString(
    'base64',
  )

export function useIpfsUpload(host = HOSTS.infura) {
  const client = create({
    host: host,
    ...(host === HOSTS.infura ? { port: INFURA_PORT } : {}),
    protocol: 'https',
    headers: {
      ...(host === HOSTS.infura
        ? { authorization: infuraAuth }
        : {
            pinata_api_key: config.PINATA_KEY,
            pinata_secret_api_key: config.PINATA_SECRET,
          }),
    },
  })

  const upload = async (file: File) => {
    const uploadedFile = await client.add(file)

    return uploadedFile.path
  }

  const uploadBase64 = async (b64Json: string) => {
    // Decode the Base64-encoded data and convert it to a Buffer object
    const imageData = Buffer.from(b64Json, 'base64')

    // Add the image to IPFS
    const uploadedFile = await client.add(imageData)

    return uploadedFile.path
  }

  const uploadMetaData = async (metadata: {
    name: string
    description: string
    image: string
    properties: {
      contractAddress: string
    }
    external_url?: string
  }) => {
    const metadataJson = JSON.stringify(metadata)

    const uploaded = await client.add(metadataJson)

    return uploaded.path
  }
  return {
    upload,
    uploadBase64,
    uploadMetaData,
  }
}
