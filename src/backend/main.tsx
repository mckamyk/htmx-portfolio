import * as elements from 'typed-html'
import { statusRoutes } from './status/routes'
import { portfolioRoutes } from './portfolio/routes'
import { AccountBalances, Accounts } from './portfolio/accounts'
import Elysia from 'elysia'

export const registerRoute = (app: Elysia) => {
  app.get("/main", Main)
  app.get("/account/balances/:address", ({params}) => AccountBalances(params.address as `0x${string}`))
  statusRoutes(app)
  portfolioRoutes(app)
}

const Main = () => (
  <div class="mt-8">
    <div class="flex justify-center gap-8">
      <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
        <div class="text-center">Reth</div>
        <div hx-trigger="load" hx-get="/status/reth/sync" hx-ext="debug">
          <div class="flex flex-col w-full items-center">
            <div class="animate-pulse rounded-md bg-gray-600 h-6 w-2/3 mb-2" />
            <div class="animate-pulse rounded-md bg-gray-600 h-6 w-full" />
          </div>
        </div>
      </div>

      <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
        <div class="text-center">Prysm</div>
        <div hx-trigger="load" hx-get="/status/prysm/sync" hx-ext="debug">
          <div class="flex flex-col items-center">
            <div class="animate-pulse rounded-md bg-gray-600 h-6 w-2/3 mb-2" />
            <div class="animate-pulse rounded-md bg-gray-600 h-6 w-full" />
          </div>
        </div>
      </div>
    </div>

    <Accounts />
  </div>
)

