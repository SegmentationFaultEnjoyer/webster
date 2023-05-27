import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { ImageNft__factory, EthProviderRpcError } from '@/types'
import { handleEthError } from '@/helpers'

export const useImageNft = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        ImageNft__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const contractInterface = ImageNft__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const mintPicture = async (recipient: string, tokenURI: string) => {
    try {
      const data = contractInterface.encodeFunctionData('mintImage', [
        recipient,
        tokenURI,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      const txHash = (receipt as { hash: string }).hash

      const txInfo = await provider.value.getTransactionReceipt(txHash)

      return txInfo
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const tokenUri = async (tokenId: string) => {
    if (!contractInstance.value) return

    try {
      const data = await contractInstance.value.tokenURI(tokenId)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const buyPicture = async (
    recipient: string,
    owner: string,
    amountToPay: string,
    tokenId: string,
    value: string,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('buyImageNFT', [
        recipient,
        owner,
        amountToPay,
        tokenId,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
        ...(value ? { value } : {}),
      })

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    mintPicture,
    tokenUri,
    buyPicture,
  }
}
