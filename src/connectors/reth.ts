import {config} from 'dotenv'
config()

const rethHost = process.env.EXEC_NODE
if (!rethHost) throw new Error("Reth Host not found in ENV!")

const headers: HeadersInit = {
  accept: 'application/json',
  'content-type': 'application/json',
}

export const getLatestRethVersion = async (): Promise<string> => {
  type returnType = {
    jsonrpc: "2.0",
    result: string,
    id: number
  }

  const data = await fetch(rethHost, {
    headers,
    method: 'post',
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "web3_clientVersion",
      params: []
    })
  }).then(r => r.json()) as returnType

  return data.result.split("/")[1] }

export const getRethMetrics = async () => {
  const metricsText = await fetch(process.env.RETH_METRICS!).then(r => r.text())
  const metricLines = metricsText.split("\n").filter(x => x.length > 0 && x[0] !== '#')

  const out: {[key:string]: string} = {};
  metricLines.forEach(l => {
    const [key, val] = l.split(' ');
    out[key] = val
  })

  return out
}

const getPrysmSyncMetrics = async () => {
  const metrics = await getRethMetrics();

  return {
  }
}
