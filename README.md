# Create Nevermined React

Create Nevermined React is a `getting started` template which includes an example with all 
the functionalities needed to start developing your `dApp` with [Nevermined](https://nevermined.io/)

## Requirements

- [nodejs](https://nodejs.org/en/)
- Walletprovider (currently we only support [Metamask](https://metamask.io/))

## How to install

There is two ways to install the getting started template:

1. Installing the script in your system
 
  * `npm i -g create-nevermined-react`
  * `create-nevermined-react my-nevermined-dapp`

2. With `npm init`

  * `npm init nevermined-react my-nevermined-dapp`

*Note:* You can overwrite `my-nevermined-dapp` by other name that you prefer

## Start the app

1. `cd my-nevermined-dapp`
2. `yarn && yarn start`

## Workflow example

The example included in the template covers the most used functionalities to work with NFT1155,
for others assets or more info please see [the documentation](http://nvm-docs.nevermined.io/).

**Requirements:** The accounts wallet used for the example need to have `Matic` and `USDC`

1. Connect the wallet
2. Click `Mint` button and approve transactions and sign authorization in the wallet
3. As an owner once the token is minted the `Mint` button will change to `Download NFT`
4. Click in `Download NFT` to get the example asset (in this case is a JSON file example)
5. Change the account in the wallet
6. Click in `Buy` button and approve transactions and sign authorization in the wallet
7. As a buyer once the token is bought the `Buy` button will change to `Download NFT`
8. Repeat the step 4

*Warning:* The data is not persistent, once that the browser is reloaded the workflow example starts
from the beginning again