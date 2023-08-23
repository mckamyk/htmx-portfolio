import {config} from 'dotenv'
import { PrometheusReturn } from '../tools/types/prometheus'
config()

const {GRAFANA_HOST: host, GRAFANA_KEY: key} = Bun.env
if (!host || !key) throw new Error("GRAFANA_KEY and GRAFANA_HOST not found")

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${key}`,
  'content-type': 'application/json'
}

const datasource = {
  type: "prometheus",
  uid: "grafanacloud-prom"
}

const getClientCount = async (): Promise<number | undefined> => {
  const data = await fetch(host + '/api/ds/query', {
    headers,
    method: 'post',
    body: JSON.stringify({
      from: 'now-3d',
      to: 'now',
      publicDashboardAccessToken: "string",
      queries: [{
        refId: 'A',
        expr: 'reth_network_connected_peers{job="reth-mainnet"}',
        datasource,
        format: "table",
        instant: true,
      }]
    })
  }).then(r => r.json()) as PrometheusReturn

  const vals = data.results.A.frames[0].data.values[1]

  return vals[0]
}

