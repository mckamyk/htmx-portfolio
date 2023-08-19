import {config} from 'dotenv'
config()

const consHost = process.env.CONS_NODE
if (!consHost) throw new Error("Consensus Host not found in ENV!")

const headers: HeadersInit = {
  accept: 'application/json',
  'content-type': 'application/json',
}

export const getLatestConsensusVersion = async (): Promise<string> => {
  type returnType = {
    data: {
      version: string
    }
  }

  const data: returnType = await fetch(consHost + "/eth/v1/node/version", {headers}).then(r => r.json())

  return data.data.version.split(' ')[0]
}

const getPrysmHealth = async () => {
  const data = await fetch(consHost + '/eth/v1/node/health', {headers}).then(r => r.json())

  console.log(data)
}

getPrysmHealth();
