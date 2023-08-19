import {createPublicClient, http} from 'viem';
import {mainnet} from 'viem/chains'
import {config} from 'dotenv'
config()

export const client = createPublicClient({
  transport: http(Bun.env.EXEC_NODE),
  chain: mainnet
})

