import Elysia from 'elysia'
import * as elements from 'typed-html'
import { getLatestConsensusVersion } from '../connectors/prysm'

export const registerRouter = (app: Elysia<any>) => {
  app.group('/prysm', app => app
    .get("/version", RethVersion)
  )
}

const RethVersion = async () => {
  const version = await getLatestConsensusVersion()
  return (
    <div class="text-center">{version}</div>
  )
}

