import {config} from 'dotenv'
import {z} from 'zod'
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

export const getPrysmHealth = async () => {
  const data = await fetch(consHost + '/eth/v1/node/health', {headers}).then(r => r.json())

  console.log(data)
}

const PrysmSyncResponseInternal = z.object({
  data: z.object({
    "head_slot": z.string().transform(Number),
    "sync_distance": z.string().transform(Number),
    "is_syncing": z.boolean(),
    "is_optimistic": z.boolean(),
    "el_offline": z.boolean(),
  })
}).transform(o => o.data)

export const getPrysmSync = async () => {
  const data = await fetch(consHost + '/eth/v1/node/syncing', {headers}).then(r => r.json())

  return PrysmSyncResponseInternal.parse(data);
}

