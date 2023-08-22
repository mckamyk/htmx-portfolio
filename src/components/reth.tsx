import Elysia from 'elysia'
import * as elements from 'typed-html'
import { getLatestRethVersion } from '../connectors/reth'

export const registerRouter = (app: Elysia<any>) => {
  app.group('/reth', app => app
    .get("/version", RethInfo)
  )
}

const RethInfo = async () => {
  const version = await getLatestRethVersion()
  return (
    <div class="w-full">
      <div class="text-center">{version}</div>
    </div>
  )
}

