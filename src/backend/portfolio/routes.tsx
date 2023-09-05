import { AccountBalances, Accounts } from "./accounts";
import { App, childPage } from "../..";

export const portfolioRoutes = (app: App) => {
  app.get('/portfolio', childPage(Accounts))
  app.get("/account/balances/:address", ({params }) => childPage(() => AccountBalances(params.address as `0x${string}`))())
}
