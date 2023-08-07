import { formatEther, isAddress } from 'viem'
import {client} from '../connectors/viem'
import * as elements from 'typed-html'

type AddressData = {
  address: `0x${string}`;
  ens?: string;
  balanceWei: bigint;
}

type GenericError = {
  message: string
}

type MaybeError<T> = [T, undefined] | [undefined, GenericError]

const gatherDataForAddress = async (address: string): Promise<MaybeError<AddressData>> => {
  if (!isAddress(address)) return [undefined, {message: `{address} doesn't look like an address.`}]
  
  const bal = client.getBalance({address})
  const ens = client.getEnsName({address})

  return [{
    address,
    balanceWei: await bal,
    ens: await ens || undefined
  }, undefined]
}

export const getBalance = async (address: string) => {
  const dataProm = gatherDataForAddress(address)
  const [addrData, err] = await dataProm
  if (err) return <div>Error: {err.message}</div>

  const {balanceWei, ens} = addrData

  return (
    <div>
      <h2>{address}</h2>
      <div>ENS: {ens || 'none'}</div>
      <div>Balance: {Number(formatEther(balanceWei)).toFixed(4)}</div>
      <div>Old Balances:</div>
      <form hx-post="/historical" hx-trigger="load">
        <input type="hidden" name="address" value={address} />
      </form>
    </div>
  )
}

export const getHistoricalBalances = async (address: string) => {
  if (!isAddress(address)) return [undefined, {message: `${address} doesn't look like an address.`}]

  const currentBlock = await client.getBlockNumber()
  const diff = BigInt(5 * 60 * 24 * 30 * 6) // 6 months of blocks
  const startBlock = currentBlock - diff
  console.log(diff, startBlock, currentBlock)
  const step = diff / BigInt(10)
  

  const blocks: bigint[] = []
  for (let x = BigInt(currentBlock); x > startBlock; x -= step) {
    blocks.unshift(x);
  }

  try {
    const balances = await Promise.all(
      blocks.map(async blockNumber => {
        return {
          block: blockNumber,
          balance: await client.getBalance({address, blockNumber}).catch(e => {throw Error(`Error at ${blockNumber}: ${e}`)}),
          timestamp: await client.getBlock({blockNumber}).then(b => new Date(Number(b.timestamp.toString())*1000))
        }
      })
    )

    return (
      <div class="grid grid-cols-2 grid-flow-row h-[300px] gap-4">
        {balances.map(b => (
          <div>
            <div>{b.block.toLocaleString()}</div>
            <div>{b.timestamp}</div>
            <div>{Number(formatEther(b.balance)).toFixed(4)}</div>
          </div>
        ))}
      </div>
    )
  } catch (e: any) {
    return (
      <pre>
        {e}
      </pre>
    )
  }
}
