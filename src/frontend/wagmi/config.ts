import {createConfig, configureChains, mainnet} from 'wagmi'
import {publicProvider} from 'wagmi/providers/public'

import {InjectedConnector} from 'wagmi/connectors/injected'

const {chains, publicClient} = configureChains([mainnet], [publicProvider()])

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
