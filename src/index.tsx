import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { appConfig } from './config'
import App from './examples/index'
import { WagmiConfig, createConfig } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { arbitrumGoerli } from 'viem/chains'

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: arbitrumGoerli,
    transport: http(),
  }),
})

createRoot(document.getElementById('root') as HTMLElement).render(
  <WagmiConfig config={config}>
    <App config={appConfig} />
  </WagmiConfig>,
)
