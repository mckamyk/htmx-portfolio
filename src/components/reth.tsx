import Elysia from 'elysia'
import * as elements from 'typed-html'
import { getLatestRethVersion } from '../connectors/reth'

export const registerRouter = (app: Elysia<any>) => {
  app.group('/reth', app => app
    .get("/version", RethVersion)
  )
}

const RethVersion = async () => {
  const version = await getLatestRethVersion()
  return (
    <div class="text-center">{version}</div>
  )
}

