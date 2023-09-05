import type { ComponentChildren } from "preact"
import React from 'react';
import { WagmiConfig } from "wagmi"
import {config} from './wagmi/config'

export const Providers = ({children}: {children: ComponentChildren}) => {
  return (
    <WagmiConfig config={config}>
      <div>hi</div>
    </WagmiConfig>
  )
}
