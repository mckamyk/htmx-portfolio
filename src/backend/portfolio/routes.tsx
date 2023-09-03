import Elysia from "elysia";
import { AccountBalances, Accounts } from "./accounts";
import { childPage } from "../..";

export const portfolioRoutes = (app: Elysia) => {
  app.get('/portfolio', childPage(Accounts))
  app.get("/account/balances/:address", ({params}) => childPage(() => AccountBalances(params.address as `0x${string}`))())
}
