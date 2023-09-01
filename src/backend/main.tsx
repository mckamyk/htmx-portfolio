import { statusRoutes } from './status/routes'
import { portfolioRoutes } from './portfolio/routes'
import { Accounts } from './portfolio/accounts'
import React from 'react'
import type Elysia from 'elysia'

export const registerRoute = (app: Elysia) => {
  statusRoutes(app)
  portfolioRoutes(app)
}

export const Main = () => (
  <div className="mt-8">
    <Accounts />
  </div>
)
