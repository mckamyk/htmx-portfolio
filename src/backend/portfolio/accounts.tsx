import * as elements from 'typed-html'
import { TokenBalance, getBalances } from '../connectors/crypto/tokens'
import { chains } from '../connectors/viem'

const chainIds =  {
  mainnet: 1,
  matic: 137,
  arbitrum: 42126,
}

const address: `0x${string}` = "0xab82910fe0a55e4aa680dbc08bae45113566c309"

export const Accounts = () => {
  return (
    <div class="flex justify-center"> 
      <div class="max-w-[1200px] grow bg-gray-800 rounded-lg h-96 mt-8 mx-4 px-4 py-2">
        <div class="text-lg">Account Balances: {address}</div>

        <div hx-get="/account/balances/0xab82910fe0a55e4aa680dbc08bae45113566c309" hx-trigger="load" />
      </div>
    </div>
  )
}

export const AccountBalances = async (account:`0x${string}`) => {
  const balances = await getBalances(account)

  const chs = Object.entries(chains).map(e => e[1])

  return (
    <div>
      {chs.map(client => {
        const relevantBalances = balances.filter(b => b.token.chainId === client.chain.id)
        if (relevantBalances.length === 0) return ''

        return (
          <div class="border-2 border-gray-900 mb-4 rounded-md overflow-clip">
            <div class="px-2 py-1 bg-gray-900 text-lg">{client.chain.name}</div>
            {relevantBalances.map(b => (
              <div class="h-12 flex items-center gap-4 pl-2">
                <img src={b.token.logoURI} class="h-8 w-8" />
                <div>
                  <div>{b.token.symbol}</div>
                  {b.token.symbol !== b.token.name ? (
                    <div class="text-sm">{b.token.name}</div>
                  ) : ''}
                </div>
                <div>{b.formatedBalance().toLocaleString()}</div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
