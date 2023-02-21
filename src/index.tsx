import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Catalog, AssetService } from '@nevermined-io/catalog'
import { appConfig } from './config'
import Example from 'examples'
import { WalletProvider, Wagmi, ConnectKit, Chains } from '@nevermined-io/providers'



ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={true}>
      <AssetService.AssetPublishProvider>
        <WalletProvider
          client={Wagmi.createClient(ConnectKit.getDefaultClient({
            chains: [Chains.polygonMumbai],
            autoConnect: true,
            appName: 'Nevermined app'
          }))}
          correctNetworkId={80001}
        >
          <Example />
        </WalletProvider>
      </AssetService.AssetPublishProvider>
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
)
