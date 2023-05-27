import { api } from '@/api'
import { JsonApiRecordBase, PageOrder } from '@/api/json-api'
import { config } from '@/config'

type NftInfo = {
  title: string
  owner: string
  metadata_hash: string
  contract_address: string
  created_at: string
}

type NftResponse = JsonApiRecordBase<'nft'> & NftInfo

export function useNftTokens() {
  const createNft = (opts: Omit<NftInfo, 'created_at'>) => {
    return api.post<NftResponse>('/nfts', {
      data: {
        attributes: opts,
      },
    })
  }

  const getNftList = (
    opts?: Partial<NftInfo> & { pageLimit?: number; pageOrder?: PageOrder },
  ) => {
    return api.get<NftResponse[]>('/nfts', {
      page: {
        limit: opts?.pageLimit ?? config.DEFAULT_PAGE_LIMIT,
        order: opts?.pageOrder ?? 'desc',
      },
      filter: {
        ...(opts?.owner ? { owner: opts.owner } : {}),
        ...(opts?.title ? { title: opts.title } : {}),
      },
    })
  }

  const getNft = (id: string) => {
    return api.get<NftInfo>(`/nfts/${id}`)
  }

  return {
    createNft,
    getNftList,
    getNft,
  }
}
