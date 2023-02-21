import React, { useEffect, useState } from 'react'
import { Catalog, AssetService, RoyaltyKind, BigNumber, getRoyaltyScheme, MetaData, DDO, AssetPrice, NFTAttributes } from '@nevermined-io/catalog'
import { useWallet, ConnectKit } from '@nevermined-io/providers'
import { UiText, UiLayout, BEM, UiButton } from '@nevermined-io/styles'
import styles from './example.module.scss'
import { appConfig, erc20TokenAddress } from '../config'

const b = BEM('example', styles)

const SDKInstance = () => {
  const { sdk, isLoadingSDK } = Catalog.useNevermined()

  return (
    <>
      <UiLayout>
        <UiText className={b('detail')} variants={['bold']}>Is Loading SDK:</UiText>
        <UiText>{isLoadingSDK ? 'Yes' : 'No'}</UiText>
      </UiLayout>

      <UiLayout>
        <UiText variants={['bold']} className={b('detail')}>Is SDK Avaialable:</UiText>
        <UiText>{sdk && Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</UiText>
      </UiLayout>
    </>
  )
}

const SingleAsset = ({ddo}: {ddo: DDO}) => {

  return (
    <>
      <UiLayout>
        <UiText className={b('detail')} variants={['bold']}>Asset {ddo.id.slice(0, 10)}...:</UiText>
      </UiLayout>
      <UiText className={b('ddo')} variants={['detail']}>{JSON.stringify(ddo)}</UiText>
    </>
  )
}

const PublishAsset = ({onPublish}: {onPublish: () => void}) => {
  const { assets } = Catalog.useNevermined()

  return (
    <>
      <UiButton onClick={onPublish} disabled={!Object.keys(assets).length}>
        mint
      </UiButton>
    </>
  )
}

const BuyAsset = ({ddo}: {ddo: DDO}) => {
  const { assets, account, isLoadingSDK, nfts, sdk } = Catalog.useNevermined()
  const { walletAddress } = useWallet()
  const [ownNFT1155, setOwnNFT1155] = useState(false)
  const [isBought, setIsBought] = useState(false)
  const [owner, setOwner] = useState('')
  
  useEffect(() => {
    (async () => {
      setOwnNFT1155(await account.isNFT1155Holder(ddo.id, walletAddress))
      setOwner(await sdk.assets.owner(ddo.id))
    })()
  }, [walletAddress, isBought])

  const buy = async () => {
    const response = await nfts.access({
      did: ddo.id, 
      nftHolder: owner,
      nftAmount: BigNumber.from(1),
      ercType: 1155
    })
    setIsBought(Boolean(response))
  }

  const download = async () => {
    await assets.downloadNFT({
      did: ddo.id
    })
  }

  return (
    <UiLayout className={b('buy')}>
      {ownNFT1155 ? (
        <UiButton onClick={download} disabled={isLoadingSDK}>
          Download NFT
        </UiButton>
      ) : (
        owner !== walletAddress ?
        <UiButton onClick={buy} disabled={isLoadingSDK}>
          buy
        </UiButton>
        : <span>The owner cannot buy, please change the account to buy the NFT asset</span>
      )}
    </UiLayout>
  )
}

const MMWallet = () => {
  return (
    <UiLayout className={b('connect')}>
      <ConnectKit.ConnectKitButton/>
    </UiLayout>
  )
}

const App = () => {
  const { isLoadingSDK, sdk } = Catalog.useNevermined()
  const { publishNFT1155 } = AssetService.useAssetPublish()
  const { walletAddress } = useWallet()
  const [ddo, setDDO] = useState<DDO>({} as DDO)

  const metadata: MetaData = {
    main: {
      name: '',
      files: [{
        index: 0,
        contentType: 'application/json',
        url: 'https://uploads5.wikiart.org/00268/images/william-holbrook-beard/the-bear-dance-1870.jpg'
      }],
      type: 'dataset',
      author: '',
      license: '',
      dateCreated: new Date().toISOString(),
    }
  }

  const onPublish = async () => {
    try {
      const assetPriceMap = new Map([
        [walletAddress, BigNumber.from(1)]
      ])
      const assetPrice = new AssetPrice(assetPriceMap)

      const networkFee = await sdk.keeper.nvmConfig.getNetworkFee()
      const feeReceiver = await sdk.keeper.nvmConfig.getFeeReceiver()
      assetPrice.addNetworkFees(feeReceiver, BigNumber.from(networkFee))
      assetPrice.setTokenAddress(erc20TokenAddress)

      const royaltyAttributes = {
        royaltyKind: RoyaltyKind.Standard,
        scheme: getRoyaltyScheme(sdk, RoyaltyKind.Standard),
        amount: 0,
      }

      const nftAttributes = NFTAttributes.getNFT1155Instance({
        metadata,
        serviceTypes: ['nft-sales', 'nft-access'],
        amount: BigNumber.from(1),
        cap: BigNumber.from(100),
        royaltyAttributes,
        preMint: true,
        nftContractAddress: sdk.nfts1155.nftContract.address,
        providers: [appConfig.neverminedNodeAddress as string],
        price: assetPrice,
      })

      const response = await publishNFT1155({
        nftAttributes
      })

      setDDO(response as DDO)
    } catch (error) {
      console.log('error', error)
    }
  }


  return (
    <div className={b('container')}>
      <SDKInstance />
      <MMWallet />
      {walletAddress && !ddo.id && (
        <PublishAsset onPublish={onPublish} />
      )}
      {!isLoadingSDK && ddo?.id &&  (
        <>
          <SingleAsset ddo={ddo}/>
          <BuyAsset ddo={ddo}/>
        </>
      )}
      
    </div>
  )
}

export default App