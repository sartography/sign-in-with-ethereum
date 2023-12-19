import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import * as React from 'react'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'


import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import {
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), publicProvider()],
)

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'wagmi',
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: '...',
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  publicClient,
  webSocketPublicClient,
})

// Pass config to React Context Provider
function App() {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  )
}

export function Profile() {
  const { address, connector, isConnected, isConnecting, status, isReconnecting, isDisconnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && connector) {
    return (
      <div>
        <img src={ensAvatar} alt="ENS Avatar" />
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector.name}</div>
        <div>status: {status}</div>
        <div>isReconnecting: {isReconnecting}</div>
        <div>isDisconnected: {isDisconnected}</div>
        <div>isConnecting: {isConnecting}</div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connectorToUse) => (
        <button
          disabled={!connectorToUse.ready}
          key={connectorToUse.id}
          onClick={() => connect({ connector: connectorToUse })}
        >
          {connectorToUse.name}
          {!connectorToUse.ready && ' (unsupported)'}
          {isLoading &&
            connectorToUse.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}

export default App
