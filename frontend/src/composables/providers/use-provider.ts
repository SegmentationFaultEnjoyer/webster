import { PROVIDERS } from '@/enums'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useMetamask, useMetamaskFallback } from '@/composables'
import {
  DesignatedProvider,
  ChainId,
  ProviderWrapper,
  TransactionResponse,
  TxRequestBody,
  TransactionReceipt,
} from '@/types'
import { errors } from '@/errors'
import { ethers } from 'ethers'

export interface UseProvider {
  currentProvider: ComputedRef<ethers.providers.Web3Provider | undefined>
  currentSigner: ComputedRef<ethers.providers.JsonRpcSigner | undefined>

  selectedProvider: Ref<PROVIDERS | undefined>
  chainId: ComputedRef<ChainId | undefined>
  selectedAddress: ComputedRef<string | undefined>
  isConnected: ComputedRef<boolean>

  init: (provider: DesignatedProvider) => Promise<void>
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: ChainId) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
  getBalance: (address: string) => Promise<string>
  signTypedData: (
    domain: ethers.TypedDataDomain,
    types: Record<string, ethers.TypedDataField[]>,
    value: Record<string, unknown>,
  ) => Promise<string | undefined>
  getTransactionReceipt: (
    transtactionHash: string,
  ) => Promise<TransactionReceipt | undefined>
}

export const useProvider = (): UseProvider => {
  const providerWrp = ref<ProviderWrapper | undefined>()

  const currentProvider = computed(
    () =>
      providerWrp.value
        ?.currentProvider as unknown as ethers.providers.Web3Provider,
  )
  const currentSigner = computed(
    () =>
      providerWrp.value
        ?.currentSigner as unknown as ethers.providers.JsonRpcSigner,
  )

  const selectedProvider = ref<PROVIDERS | undefined>()
  const chainId = computed(
    () => providerWrp.value?.chainId as ChainId | undefined,
  )
  const selectedAddress = computed(
    () => providerWrp.value?.selectedAddress as string | undefined,
  )
  const isConnected = computed(() =>
    Boolean(chainId.value && selectedAddress.value),
  )

  const init = async (provider: DesignatedProvider) => {
    switch (provider.name as PROVIDERS) {
      case PROVIDERS.metamask:
        providerWrp.value = useMetamask(provider.instance)
        break
      case PROVIDERS.metamaskFallback:
        providerWrp.value = useMetamaskFallback(provider.instance)
        break
      default:
        throw new Error('Invalid Provider')
    }
    selectedProvider.value = provider.name
    await providerWrp.value?.init()
  }

  const connect = async () => {
    if (!providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    await providerWrp.value.connect()
  }

  const disconnect = () => {
    providerWrp.value = undefined
  }

  const switchChain = async (chainId: ChainId) => {
    if (!providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    await providerWrp.value.switchChain(chainId)
  }

  const signAndSendTx = async (
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> => {
    if (!providerWrp.value || !providerWrp.value?.signAndSendTransaction)
      throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.value.signAndSendTransaction(txRequestBody)
  }

  const getHashFromTxResponse = (txResponse: TransactionResponse): string => {
    if (!providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.value.getHashFromTxResponse(txResponse)
  }

  const getTxUrl = (explorerUrl: string, txHash: string): string => {
    if (!providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.value.getTxUrl(explorerUrl, txHash)
  }

  const getAddressUrl = (explorerUrl: string, address: string): string => {
    if (!providerWrp.value)
      throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.value.getAddressUrl(explorerUrl, address)
  }

  const getBalance = (address: string): Promise<string> => {
    if (!providerWrp.value || !providerWrp.value?.getBalance)
      throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.value.getBalance(address)
  }

  const signTypedData = (
    domain: ethers.TypedDataDomain,
    types: Record<string, ethers.TypedDataField[]>,
    value: Record<string, unknown>,
  ) => {
    if (!providerWrp.value?.signTypedData)
      throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.value.signTypedData(domain, types, value)
  }

  const getTransactionReceipt = async (transactionHash: string) => {
    if (!providerWrp.value || !providerWrp.value.getTransactionReceipt)
      throw new errors.ProviderWrapperMethodNotFoundError()

    return providerWrp.value.getTransactionReceipt(transactionHash)
  }

  return {
    currentProvider,
    currentSigner,

    selectedProvider,
    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    disconnect,
    switchChain,
    signAndSendTx,
    getHashFromTxResponse,
    getTxUrl,
    getAddressUrl,
    getBalance,
    signTypedData,
    getTransactionReceipt,
  }
}
