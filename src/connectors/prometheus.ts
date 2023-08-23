import {config} from 'dotenv'
config()

const {GRAFANA_HOST: host, GRAFANA_KEY: key} = Bun.env
if (!host || !key) throw new Error("GRAFANA_KEY and GRAFANA_HOST not found")

const headers = {
  accept: 'application/json',
  Authorization: key,
  'content-type': 'application/json'
}

const datasource = {
  type: "prometheus",
  uid: "grafanacloud-prom"
}

console.log(headers)

const getClientCount = async () => {
  const res = fetch('https://mckamyk.grafana.net/api/access-control/roles', {
    headers,
    method: 'post',
    body: JSON.stringify({
      from: 'now-1d',
      to: 'now',
      publicDashboardAccessToken: "string",
      queries: [{
        refId: 'A',
        expr: 'reth_sync_checkpoint{job="reth-mainnet"}',
        range: false,
        datasource,
        format: "table",
        instant: true,
      }]
    })
  })

  const d = await res.then(r => r.json())
  console.log((await res).headers.get('Authorization'))

  console.log(await res)
  console.log(d)
}

getClientCount()
