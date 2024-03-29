import { NeverminedOptions } from '@nevermined-io/sdk'

export const neverminedNodeAddress =
  process.env.REACT_APP_NEVERMINED_NODE_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
export const neverminedNodeUri =
  process.env.REACT_NEVERMINED_NODE_URI || 'https://node.goerli.nevermined.one'
export const acceptedChainId = process.env.REACT_APP_ACCEPTED_CHAIN_ID || '80001' // for Mumbai
export const rootUri = process.env.REACT_APP_ROOT_URI || 'http://localhost:3445'
export const marketplaceUri =
  process.env.REACT_APP_MARKETPLACE_API || 'https://marketplace-api.goerli.nevermined.one'
const graphHttpUri =
  process.env.REACT_APP_GRAPH_HTTP_URI ||
  'https://api.thegraph.com/subgraphs/name/nevermined-io/staging'
export const erc20TokenAddress =
  process.env.REACT_APP_ERC20_TOKEN_ADDRESS || '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'
export const web3ProviderUri =
  process.env.REACT_APP_WEB3_PROVIDER_URI || 'https://goerli-rollup.arbitrum.io/rpc'

export const appConfig: NeverminedOptions = {
  web3Provider: typeof window !== 'undefined' ? window.ethereum : '',
  neverminedNodeUri,
  verbose: 2,
  neverminedNodeAddress,
  graphHttpUri,
  marketplaceAuthToken: localStorage.getItem('marketplaceApiToken') || '',
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`,
}
