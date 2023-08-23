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
      <div class="text-center mb-2">{version}</div>
      <RethSync />
    </div>
  )
}

const RethSync = () => {
  // Reth has 13 Sync stages
  // Progress should be 0 -> Current block

  return (
    <div class="text-center bg-gray-600 rounded-md">
      Waiting on Prysm Sync
    </div>
  )
}

