import {createConfig, configureChains, mainnet} from 'wagmi'
import {alchemyProvider} from 'wagmi/providers/alchemy'

import {InjectedConnector} from 'wagmi/connectors/injected'

const alchemyKey = Bun.env.ALCHEMY_KEY
if (!alchemyKey) throw new Error("No alchemy key!")

const {chains, publicClient} = configureChains([mainnet], [alchemyProvider({apiKey: Bun.env.ALCHEMY_KEY!})])

export const config = createConfig({
  publicClient,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: "injected",
      }
    })
  ]
})
