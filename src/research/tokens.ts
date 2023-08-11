import {client} from '../connectors/viem'
import {getFunctionSelector} from 'viem/utils'

const erc20Functions = [
  'transfer(address,uint256)'
]

const tokens = {
  name: 'USDC',
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
}


const getSignatures = () => {
  return erc20Functions.map(getFunctionSelector)
}

const watchForTransfers = () => {
  const watcher = client.watchBlockNumber({
    onBlockNumber: getTransfersInBlock
  });
}

const getTransfersInBlock = async (blockNumber: bigint) => {
  console.log("Querying Block", blockNumber.toLocaleString())

  const sig = getSignatures()[0]
  const hashes = await client.getBlock({blockNumber}).then(b => b.transactions)
  const transactions = await Promise.all(hashes.map(hash => client.getTransaction({hash}).catch(() => undefined)))
  const usdcTransfers = transactions.filter(tx => {
    return tx !== undefined && tx.to && tx.input && tx.input.includes(sig)
  })

  console.log(`Transfer in block ${blockNumber.toLocaleString()}: ${
    usdcTransfers ? usdcTransfers.map(t => `\n\t${t?.hash} -> ${t?.to}`) : '<none>'
  }`)
}

const topTransfers = async (numBlocks: number) => {
  const current = await client.getBlockNumber()
  const sig = getSignatures()[0]

  const matching: `0x${string}`[] = []

  for (let x = 0; x < numBlocks; x++) {
    const thisBlock = current - BigInt(x);
    const block = await client.getBlock({blockNumber: thisBlock})
    const transactions = await Promise.all(block.transactions.map(hash => client.getTransaction({hash})))
    transactions.forEach(tx => {
      if (tx.to && tx.to === tokens.address && tx.input && tx.input.includes(sig)) matching.push(tx.hash)
    })
  }

  console.log(matching)
}

watchForTransfers()
