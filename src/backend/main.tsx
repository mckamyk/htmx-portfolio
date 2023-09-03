import { statusRoutes } from './status/routes'
import { portfolioRoutes } from './portfolio/routes'
import { Accounts } from './portfolio/accounts'
import React from 'react'
import type Elysia from 'elysia'

export const registerRoute = (app: Elysia) => {
  statusRoutes(app)
  portfolioRoutes(app)
}

const Main = () => (
  <>
    <div className="mt-2 flex justify-center">
      <div className="w-[800px]">
        <a className="text-blue-500 underline" href="/status">Status</a>
      </div>
    </div>
    <div className="mt-6">
      <Accounts />
    </div>
  </>
)

export {Main}
