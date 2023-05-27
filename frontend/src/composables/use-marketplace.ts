import { api } from '@/api'
import { JsonApiRecordBase, PageOrder } from '@/api/json-api'
import { config } from '@/config'
import { useImageNft } from '@/composables'
import { BN, BnLike } from '@/utils/math.util'
import { formatIPFSLink } from '@/helpers'

type OfferInfo = {
  title: string
  seller: string
  buyer: string
  token_uri: string
  token_id: string
  contract_address: string
  price: string // wei string
  created_at: string
  is_enabled: boolean
}

type NftMetadata = {
  name: string
  description: string
  image: string
  properties: {
    contractAddress: string
  }
}

export type OfferResponse = JsonApiRecordBase<'offer'> & OfferInfo

export type FullNftInfo = OfferResponse & NftMetadata

export function useMarketplace() {
  const { mintPicture, buyPicture } = useImageNft(
    config.NFT_IMAGE_CONTRACT_ADDRESS,
  )

  const createOffer = async (
    opts: Omit<OfferInfo, 'created_at' | 'token_id' | 'is_enabled' | 'buyer'>,
  ) => {
    const receipt = await mintPicture(opts.seller, opts.token_uri)

    if (!receipt) throw new Error('failed to get receipt')

    const tokenIdHex = receipt.logs[0].topics.at(-1) as BnLike
    const tokenIdInt = Number(new BN(tokenIdHex).toString())

    const weiPrice = new BN(opts.price).toWei().toString()

    return api.post<OfferResponse>('/nfts', {
      data: {
        attributes: {
          ...opts,
          token_id: tokenIdInt,
          price: weiPrice,
        },
      },
    })
  }

  const getOffersList = async (
    opts?: Partial<OfferInfo> & { pageLimit?: number; pageOrder?: PageOrder },
  ) => {
    const data = await api.get<OfferResponse[]>('/nfts', {
      page: {
        limit: opts?.pageLimit ?? config.DEFAULT_PAGE_LIMIT,
        order: opts?.pageOrder ?? 'desc',
      },
      filter: {
        ...(opts?.seller ? { seller: opts.seller } : {}),
        ...(opts?.buyer ? { buyer: opts.buyer } : {}),
        ...(opts?.title ? { title: opts.title } : {}),
        ...(opts?.is_enabled !== undefined
          ? { is_enabled: opts.is_enabled }
          : {}),
      },
    })
    return data
  }

  const updateOffer = (opts: Partial<OfferInfo> & { id: string }) => {
    return api.patch(`/nfts/${opts.id}`, {
      data: {
        attributes: {
          ...(opts.title ? { title: opts.title } : {}),
          ...(opts.price
            ? { price: new BN(opts.price).toWei().toString() }
            : {}),
          ...(opts.buyer ? { buyer: opts.buyer } : {}),
          ...(opts?.is_enabled !== undefined
            ? { is_enabled: opts.is_enabled }
            : {}),
        },
      },
    })
  }

  const getOffer = (id: string) => {
    return api.get<OfferResponse>(`/nfts/${id}`)
  }

  const deleteOffer = (id: string) => {
    return api.delete(`/nfts/${id}`)
  }

  const addMetadataToItem = async (
    data: OfferResponse,
  ): Promise<FullNftInfo> => {
    const metadata: NftMetadata = await (
      await fetch(formatIPFSLink(data.token_uri))
    ).json()

    if (!metadata) throw new Error('failed to fetch metadata')

    return { ...data, ...metadata }
  }

  const addMetadataToList = async (data: OfferResponse[]) => {
    const dataWitMetadata: FullNftInfo[] = []

    for (const nft of data) {
      const metadata = await addMetadataToItem(nft)
      dataWitMetadata.push({ ...nft, ...metadata })
    }

    return dataWitMetadata
  }

  const buyToken = async (
    recipient: string,
    seller: string,
    price: string,
    tokenId: string,
  ) => {
    await buyPicture(recipient, seller, price, tokenId, price)

    await updateOffer({
      is_enabled: false,
      buyer: recipient,
      id: tokenId,
    })
  }

  return {
    createOffer,
    updateOffer,
    getOffersList,
    getOffer,
    deleteOffer,
    addMetadataToList,
    addMetadataToItem,
    buyToken,
  }
}
