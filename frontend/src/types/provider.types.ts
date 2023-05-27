import { ComputedRef, Ref } from 'vue'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import { ethers } from 'ethers'

import { PROVIDERS } from '@/enums'
import { EthereumProvider } from '@/types'

/**
 * Non defined provider from browser
 */
export type ProviderInstance = EthereumProvider | unknown

/**
 * provider, which we've designated, it has a name and instance
 */
export type DesignatedProvider = {
  name: PROVIDERS
  instance: ProviderInstance
}

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
}

export type TxRequestBody = Deferrable<TransactionRequest> | string | unknown

export type EthTransactionResponse = ethers.providers.TransactionResponse

export type TransactionResponse = EthTransactionResponse | unknown

export type TransactionReceipt = ethers.providers.TransactionReceipt

/**
 * composable object of designated provider,
 * which we can use to solve user needs
 */
export interface ProviderWrapper {
  currentProvider?: ComputedRef<ethers.providers.Web3Provider>
  currentSigner?: ComputedRef<ethers.providers.JsonRpcSigner>

  chainId: Ref<ChainId>
  selectedAddress: Ref<string>
  isConnected: ComputedRef<boolean>

  init: () => Promise<void>
  connect: () => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>
  signAndSendTransaction?: (
    txRequestBody: TxRequestBody,
  ) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
  getBalance?: (address: string) => Promise<string>
  signTypedData?: (
    domain: ethers.TypedDataDomain,
    types: Record<string, ethers.TypedDataField[]>,
    value: Record<string, unknown>,
  ) => Promise<string | undefined>
  getTransactionReceipt?: (
    transtactionHash: string,
  ) => Promise<TransactionReceipt | undefined>
}

export type { UseProvider } from '@/composables'
