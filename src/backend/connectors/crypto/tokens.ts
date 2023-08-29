import {tokenLists} from './tokenDirectory'
import {mainnetClient, arbitrumClient, maticClient} from '../viem'
import { ERC20 } from './types'
import { serverLog } from '../../../logger'
import {readContract} from 'viem/contract'
import { parseAbi, parseAbiItem } from 'viem'

const myAddress = '0xAB82910FE0a55E4Aa680DBc08bae45113566c309'

const mainnetToks = tokenLists.find(l => l.chainId === 1)?.tokens
const maticToks = tokenLists.find(l => l.chainId === 137)?.tokens
const arbitrumToks = tokenLists.find(l => l.chainId === 42161)?.tokens

const tokensToGet = ['USDC', 'DAI', 'WETH', 'ENS', 'USDT']

const getBalances = async () => {
  if (!mainnetToks || !maticToks || !arbitrumToks) {
    serverLog.error("Failed to load token lists.");
    return
  }

  const ts: ERC20[] = [
    ...mainnetToks.filter(t => tokensToGet.includes(t.symbol || "")),
    ...maticToks.filter(t => tokensToGet.includes(t.symbol || "")),
    ...arbitrumToks.filter(t => tokensToGet.includes(t.symbol || ""))
  ]

  const clients = [arbitrumClient, mainnetClient, maticClient]

  const proms = ts.map(t => {
    const client = clients.find(c => c.chain.id === t.chainId) as any
    const rsp = readContract(client, {
        address: t.address as `0x${string}`,
        functionName: 'balanceOf',
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        args: [myAddress]
    })

    return rsp
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
  }).filter(v => !!v) as bigint[]
}

getBalances();

