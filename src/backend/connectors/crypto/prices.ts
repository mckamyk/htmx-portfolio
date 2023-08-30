import {config} from 'dotenv'
import { cmcPriceReturn, TokenBalance } from './types'
import { serverLog } from '../../../logger'
config()

const key = Bun.env.CMC_KEY
const host = Bun.env.CMC_HOST
if (!key) throw new Error("No CMC Key [CMC_KEY]")
if (!host) throw new Error("No CMC Host [CMC_HOST]")

const headers = {
  'X-CMC_PRO_API_KEY': key,
  accept: 'application/json',
  'content-type': 'application/json'
}

const isDefined = <T>(arg: T | undefined): arg is T => {
  return arg !== undefined
}

export const getTokenPrices = async (tokens: TokenBalance[]) => {
  const symbol = tokens.map(t => t.token.symbol).filter(isDefined).reduce((prev, curr): string[] => {
    return prev.includes(curr) ? prev : [...prev, curr]
  }, [] as string[]).join(',')

  const params = new URLSearchParams({
    symbol,
    convert: "USD"
  })

  const result = await fetch(`${host}/v2/cryptocurrency/quotes/latest?` + params, {headers})
    .then(r => r.json()).then(cmcPriceReturn.parse).catch(e => serverLog.error(JSON.stringify(e, undefined, 2)))

  return result
}

