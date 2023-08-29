import Elysia from "elysia";
import { Accounts } from "./accounts";

export const portfolioRoutes = (app: Elysia) => {
  app.get('/portfolio', Accounts)
}
