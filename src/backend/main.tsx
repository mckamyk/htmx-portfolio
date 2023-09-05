import { statusRoutes } from './status/routes'
import { portfolioRoutes } from './portfolio/routes'
import { Accounts } from './portfolio/accounts'
import React from 'react'
import type Elysia from 'elysia'
import Header from './header'

export const registerRoute = (app: Elysia) => {
  statusRoutes(app)
  portfolioRoutes(app)
}

const Main = () => (
  <>
    <Header />
    <div className="mt-6">
      <Accounts />
    </div>
  </>
)

export {Main}
