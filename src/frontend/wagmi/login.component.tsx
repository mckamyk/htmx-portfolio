import { registerComponent } from '../tools/componentWrapper'
import React, { useEffect, useState } from 'react'
import {Providers} from '../providers'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import {trpc} from '../trpc/client'

const Wrapped = () => {
  return (
    <Providers>
      <Button />
    </Providers>
  )
}

const Button = () => {
  const {connect, connectors} = useConnect()
  const {isConnected, address} = useAccount()
  const {chain} = useNetwork();
  const [nonce, setNonce] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const {signMessageAsync} = useSignMessage();
  const connector = connectors[0]

  const getNonce = async () => {
    const nonce = await trpc.nonce.query()
    setNonce(nonce)
  }

  const getIsLoggedIn = async () => {
    const valid = await trpc.isVerified.query()
    setIsLoggedIn(valid)
  }

  useEffect(() => {
    getIsLoggedIn
  }, [])

  useEffect(() => {
    if (!isLoggedIn) getNonce()
  }, [isLoggedIn])

  useEffect(() => {
    if (isConnected && !isLoggedIn) signIn()
  }, [isConnected, isLoggedIn])

  const signIn = async () => {
    if (!isConnected || !nonce || !chain) return

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum",
      uri: window.location.origin,
      version: '1',
      chainId: chain.id,
      nonce
    })

    const signature = await signMessageAsync({message: message.prepareMessage()})

    const verify = await trpc.verify.query({message, signature})
    console.log(`Sign in success: ${verify}`)
  }

  return (
    <button disabled={!connector.ready} onClick={() => connect({connector})}>{connector.name}</button>
  )
}

registerComponent(Wrapped, 'wagmi-login')

