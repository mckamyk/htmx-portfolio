import Elysia from "elysia";
import { RethInfo } from "./reth";
import { PrysmInfo } from './prysm'

export const statusRoutes = (app: Elysia) => {
  app.get('/status/reth/sync', RethInfo)
  app.get('/status/prysm/sync', PrysmInfo)
}
