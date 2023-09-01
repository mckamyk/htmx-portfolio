import Elysia from "elysia";
import { RethInfo } from "./reth";
import { PrysmInfo } from './prysm'
import { Status } from ".";
import { rootPage, childPage } from "../..";

export const statusRoutes = (app: Elysia) => {
  app.get('/status', rootPage(Status))
  app.get('/status/reth', childPage(RethInfo))
  app.get('/status/prysm', childPage(PrysmInfo))
}
