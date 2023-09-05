import { RethInfo } from "./reth";
import { PrysmInfo } from './prysm'
import { Status } from ".";
import { rootPage, childPage, App } from "../..";

export const statusRoutes = (app: App) => {
  app.get('/status', rootPage(Status))
  app.get('/status/reth', childPage(RethInfo))
  app.get('/status/prysm', childPage(PrysmInfo))
}
