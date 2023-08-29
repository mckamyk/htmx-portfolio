import {tokenLists} from './tokenDirectory'
import {mainnetClient, arbitrumClient, maticClient} from '../viem'
import { ERC20 } from './types'
import { serverLog } from '../../../logger'
import {readContract} from 'viem/contract'
import { parseAbi } from 'viem'
import { formatWithDecimals } from '../../tools/tokenFormat'

const mainnetToks = tokenLists.find(l => l.chainId === 1)?.tokens
const maticToks = tokenLists.find(l => l.chainId === 137)?.tokens
const arbitrumToks = tokenLists.find(l => l.chainId === 42161)?.tokens

if (!mainnetToks || !maticToks || !arbitrumToks) {
  serverLog.error("Failed to load token lists.");
  process.exit(-1)
}

const tokensToGet = ['USDC', 'DAI', 'WETH', 'ENS', 'USDT']

export type TokenBalance = {
  token: ERC20,
  balance: bigint,
  formatedBalance: () => number
}

export const getBalances = async (account: `0x${string}`): Promise<TokenBalance[]> => {
  const ts: ERC20[] = [
    ...mainnetToks.filter(t => tokensToGet.includes(t.symbol || "")),
    ...maticToks.filter(t => tokensToGet.includes(t.symbol || "")),
    ...arbitrumToks.filter(t => tokensToGet.includes(t.symbol || ""))
  ]

  const clients = [arbitrumClient, mainnetClient, maticClient]

  const proms = ts.map(async t => {
    const client = clients.find(c => c.chain.id === t.chainId) as any
    const bal = await readContract(client, {
        address: t.address as `0x${string}`,
        functionName: 'balanceOf',
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        args: [account]
    }).catch(e => serverLog.error(`Token Balance lookup failed for ${t.name} (${t.address}) on chain ${t.chainId}`))

    if (!bal) return null

    return {
      token: t,
      balance: bal,
      formatedBalance: () => formatWithDecimals(bal, t.decimals)
    } as TokenBalance
  })

  const settled = await Promise.allSettled(proms)

  const resolved = settled.filter(p => p.status === 'fulfilled')
  const rejected = settled.filter(p => p.status === 'rejected')

  rejected.forEach(p => {
    if (p.status !== 'rejected') return;

    serverLog.error(`Token balance lookup failed: ${p.reason}`)
  })

  return resolved.map(r => {
    if (r.status !== 'fulfilled') return null
    return r.value
  }).filter(v => v && v.balance) as TokenBalance[]
}

