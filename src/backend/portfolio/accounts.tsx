import { getBalances } from '../connectors/crypto/tokens'
import React from 'react'
import { chains } from '../connectors/viem'

const address: `0x${string}` = "0xab82910fe0a55e4aa680dbc08bae45113566c309"

export const Accounts = () => {
  return (
    <div className="flex justify-center"> 
      <div className="max-w-[1200px] grow bg-gray-800 rounded-lg h-96 mt-8 mx-4 px-4 py-2">
        <div className="text-lg">Account Balances: {address}</div>

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
            {relevantBalances.map(b => {
              let value: string | undefined = undefined
              
              if (b.price) {
                value = (Math.round(b.formatedBalance() * b.price * 100)/100).toFixed(2)
              }

              return (
              <div class="h-12 flex items-center gap-4 pl-2">
                <img src={b.token.logoURI} class="h-8 w-8" />
                <div>
                  <div>{b.token.symbol}</div>
                  {b.token.symbol !== b.token.name ? (
                    <div className="text-sm">{b.token.name}</div>
                  ) : ''}
                </div>
                <div>{b.formatedBalance().toLocaleString()}</div>
                {value ? <div>{`$${value}`}</div> : ''}
                {b.delta ? <div>{b.delta > 0 ? '+' : '-'}{Math.abs(b.delta).toFixed(2)}%</div> : ''}
              </div>
            )})}
          </div>
        )
      })}
    </div>
  )
}
