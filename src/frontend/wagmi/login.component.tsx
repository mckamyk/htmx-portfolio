import { registerComponent } from '../tools/componentWrapper'
import React from 'react'
import {Providers} from '../providers'
import { useConnect } from 'wagmi'

const Wrapped = () => {
  return (
    <Providers>
      <Button />
    </Providers>
  )
}

const Button = () => {
  const {connect, connectors} = useConnect()
  const connector = connectors[0]

  return (
    <button disabled={!connector.ready} onClick={() => connect({connector})}>{connector.name}</button>
  )
}

registerComponent(Wrapped, 'wagmi-login')

