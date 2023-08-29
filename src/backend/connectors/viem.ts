import {createPublicClient, http} from 'viem';
import {arbitrum, mainnet, polygon} from 'viem/chains'
import {config} from 'dotenv'
config()

export const mainnetClient = createPublicClient({
  transport: http(Bun.env.MAINNET_URL),
  chain: mainnet
})

export const maticClient = createPublicClient({
  transport: http(Bun.env.MATIC_URL),
  chain: polygon
})

export const arbitrumClient = createPublicClient({
  transport: http(Bun.env.MATIC_URL),
  chain: arbitrum
})

