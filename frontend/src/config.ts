import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { pickBy, mapKeys } from 'lodash-es'

export const config = {
  API_URL: import.meta.env.VITE_APP_API_URL,
  APP_NAME: import.meta.env.VITE_APP_APP_NAME,
  DEFAULT_RPC_URL: import.meta.env.VITE_APP_DEFAULT_RPC_URL,
  DEFAULT_IMAGE: import.meta.env.VITE_APP_DEFAULT_IMAGE_LINK,
  GITHUB_LINK: import.meta.env.VITE_APP_GITHUB_LINK,
  TELEGRAM_LINK: import.meta.env.VITE_APP_TELEGRAM_LINK,
  INFURA_API_KEY: import.meta.env.VITE_APP_INFURA_KEY,
  INFURA_PROJECT_ID: import.meta.env.VITE_APP_INFURA_PROJECT_ID,
  PINATA_KEY: import.meta.env.VITE_APP_PINATA_KEY,
  PINATA_SECRET: import.meta.env.VITE_APP_PINATA_SECRET,
  IPFS_GATEWAY: import.meta.env.VITE_APP_IPFS_GATEWAY,
  NFT_IMAGE_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_NFT_IMAGE_CONTRACT_ADDRESS,
  CHAIN_ID: import.meta.env.VITE_APP_CHAIN_ID,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  DEFAULT_PAGE_LIMIT: 15,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
