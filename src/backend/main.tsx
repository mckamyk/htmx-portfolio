import { statusRoutes } from './status/routes'
import { portfolioRoutes } from './portfolio/routes'
import { Accounts } from './portfolio/accounts'
import React from 'react'
import Header from './header'
import { App } from '..'

export const registerRoute = (app: App) => {
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
