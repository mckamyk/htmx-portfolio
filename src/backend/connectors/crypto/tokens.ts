import {tokenLists} from './tokenDirectory'
import {mainnetClient, arbitrumClient, maticClient} from '../viem'
import { ERC20, TokenBalance } from './types'
import { serverLog } from '../../../logger'
import {readContract} from 'viem/contract'
import { parseAbi } from 'viem'
import { formatWithDecimals } from '../../tools/tokenFormat'
import { getTokenPrices } from './prices'
import { isArrayGuard } from '../../tools/typeGuards'

const mainnetToks = tokenLists.find(l => l.chainId === 1)?.tokens
const maticToks = tokenLists.find(l => l.chainId === 137)?.tokens
const arbitrumToks = tokenLists.find(l => l.chainId === 42161)?.tokens

if (!mainnetToks || !maticToks || !arbitrumToks) {
  serverLog.error("Failed to load token lists.");
  process.exit(-1)
}

const tokensToGet = ['USDC', 'DAI', 'WETH', 'ENS', 'USDT']

const isNotNull = <T>(arg: T | null): arg is T => {
  return arg !== null
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
    }).catch(() => serverLog.error(`Token Balance lookup failed for ${t.name} (${t.address}) on chain ${t.chainId}`))

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

  const withBalance = resolved.map(r => {
    if (r.status !== 'fulfilled') return null
    return r.value
  }).filter(isNotNull)

  const prices = await getTokenPrices(withBalance)

  if (!prices) return withBalance

  const withPrices = withBalance.map(t => {
    const symbol = t.token.symbol
    if (!symbol) return t

    const priceData = prices.data[symbol]

    if (isArrayGuard(priceData)) {
      priceData.sort((a, b) => {
        const mka = a.quote['USD'].market_cap
        const mkb = b.quote['USD'].market_cap

        return mkb-mka
      })

      const quote = priceData[0].quote["USD"]
      return {...t, price: quote.price, delta: quote.percent_change_24h }
    } else {
      const quote = priceData.quote["USD"]
      return {...t, price: quote.price, delta: quote.percent_change_24h }
    }
  })

  return withPrices
}

