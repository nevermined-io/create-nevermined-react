import React, { useEffect, useState } from 'react'
import {
  MetaData,
  DDO,
  NFTAttributes,
  Nevermined,
  Logger,
  Account,
  NeverminedOptions,
} from '@nevermined-io/sdk'
import {} from '@nevermined-io/sdk'
import { UiText, UiLayout, BEM, UiButton } from '@nevermined-io/styles'
import styles from './example.module.scss'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'
import { BigNumber } from 'ethers'

const b = BEM('example', styles)

const loginMarketplace = async (sdk: Nevermined, account: Account) => {
  const clientAssertion = await sdk.utils.jwt.generateClientAssertion(account)
  await sdk.services.marketplace.login(clientAssertion)
}

const PublishAsset = ({ onPublish }: { onPublish: () => void }) => {
  return (
    <>
      <UiButton className={b('mint')} type="secondary" onClick={onPublish}>
        mint
      </UiButton>
    </>
  )
}

const SingleAsset = ({ ddo }: { ddo: DDO }) => {
  return (
    <>
      <UiLayout>
        <UiText className={b('detail')} variants={['bold']}>
          Asset {ddo.id.slice(0, 10)}...:
        </UiText>
      </UiLayout>
      <UiText className={b('ddo')} variants={['detail']}>
        {JSON.stringify(ddo)}
      </UiText>
    </>
  )
}

const BuyAsset = ({ ddo, sdk, account }: { ddo: DDO; sdk: Nevermined; account: Account }) => {
  const [ownNFT1155, setOwnNFT1155] = useState(false)
  const [isBought, setIsBought] = useState(false)
  const [owner, setOwner] = useState('')

  useEffect(() => {
    void (async () => {
      const balance = await sdk.nfts1155.balance(ddo.id, account)
      const nftBalance = BigNumber.from(balance).toNumber()
      setOwnNFT1155(nftBalance > 0)
      setOwner(await sdk.assets.owner(ddo.id))
    })()
  }, [account, isBought])

  const onBuy = async () => {
    await loginMarketplace(sdk, account)

    try {
      const agreementId = await sdk.nfts1155.order(ddo.id, BigInt(1), account)
      const transferResult = await sdk.nfts1155.transfer(agreementId, owner, BigInt(1), account)

      setIsBought(Boolean(transferResult))
    } catch (error) {
      Logger.error(error)
    }
  }

  const onDownload = async () => {
    try {
      await sdk.nfts1155.access(ddo.id, account)
    } catch (error) {
      Logger.error(error)
    }
  }

  return (
    <UiLayout className={b('buy')}>
      {ownNFT1155 ? (
        <UiButton type="secondary" onClick={onDownload}>
          Download NFT
        </UiButton>
      ) : owner !== account.getId() ? (
        <UiButton type="secondary" onClick={onBuy}>
          buy
        </UiButton>
      ) : (
        <span>The owner cannot buy, please change the account to buy the NFT asset</span>
      )}
    </UiLayout>
  )
}

const App = ({ config }: { config: NeverminedOptions }) => {
  const [sdk, setSdk] = useState<Nevermined>({} as Nevermined)
  const [account, setAccount] = useState<Account>({} as Account)
  const [ddo, setDDO] = useState<DDO>({} as DDO)
  const [walletAddress, setWalletAddress] = useState('')
  const { address } = useAccount()
  const [connector, setConnector] = useState({} as Connector)
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const logIn = async () => {
    console.log(connector)
    if (connector.ready) {
      connect({ connector })
      setConnector(connector)
    }
  }

  useEffect(() => {
    setConnector(connectors[0])
  }, [connectors])

  useEffect(() => {
    if (!address || !Object.keys(connector).length) {
      return
    }

    // eslint-disable-next-line
    void (window as any)?.ethereum?.on('accountsChanged', (newAccount: string[]) => {
      if (newAccount && newAccount.length > 0) {
        setWalletAddress(address)
      } else {
        setWalletAddress('')
        console.log('No Account found!')
      }
    })
    void (async () => {
      // eslint-disable-next-line
      setWalletAddress(address)
    })()
  }, [address, connector])

  useEffect(() => {
    if (walletAddress) {
      void (async () => {
        try {
          const nvm = await Nevermined.getInstance(config)
          const account = await nvm.accounts.getAccount(walletAddress)

          setAccount(account)
          setSdk(nvm)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [walletAddress])

  const publishNFT1155 = async (
    nodeAddress: string,
    accountWallet: Account,
    metadata: MetaData,
  ) => {
    const nftAttributes = NFTAttributes.getNFT1155Instance({
      metadata,
      cap: BigInt(100),
      preMint: true,
      nftContractAddress: sdk.nfts1155.nftContract.address,
      providers: [nodeAddress],
    })

    const ddo = await sdk.nfts1155.create(nftAttributes, accountWallet)

    return ddo
  }

  const onPublish = async () => {
    try {
      const metadata: MetaData = {
        main: {
          name: '',
          files: [
            {
              index: 0,
              contentType: 'application/json',
              url: 'https://uploads5.wikiart.org/00268/images/william-holbrook-beard/the-bear-dance-1870.jpg',
            },
          ],
          type: 'dataset',
          author: '',
          license: '',
          dateCreated: new Date().toISOString(),
        },
      }

      await loginMarketplace(sdk, account)

      const response = await publishNFT1155(
        config.neverminedNodeAddress as string,
        account,
        metadata,
      )

      setDDO(response as DDO)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className={b('container')}>
      <UiLayout>
        {Object.keys(account).length ? (
          <>
            <UiText variants={['bold']} className={b('detail')}>
              Wallet address:
            </UiText>
            <UiText>{account.getId()}</UiText>
            <UiButton type="secondary" onClick={() => disconnect()}>
              disconnect
            </UiButton>
          </>
        ) : (
          <UiButton type="secondary" onClick={logIn}>
            Connect To Nevermined
          </UiButton>
        )}

        {walletAddress && !ddo.id && <PublishAsset onPublish={onPublish} />}

        {ddo?.id && (
          <>
            <SingleAsset ddo={ddo} />
            <BuyAsset ddo={ddo} sdk={sdk} account={account} />
          </>
        )}
      </UiLayout>
    </div>
  )
}

export default App
