import { WagmiConfig } from "wagmi"
import React from 'react';
import {config} from './wagmi/config'
import { ReactNode } from "react"

export const Providers = ({children}: {children: ReactNode}) => {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
