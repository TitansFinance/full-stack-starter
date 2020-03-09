import React, { useEffect, useState } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { MdMonetizationOn, MdLink } from 'react-icons/md'
import copy from 'copy-to-clipboard'
import { useTranslation } from 'react-i18next'

import CurrencyIcon from '@/components/CurrencyIcon'
import QRCode from '@/components/QRCode'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Loading from '@/components/Loading'

import './ModalContentDepositCurrency.sass'


const ModalContentDepositCurrency = ({
  currency = null,
  children = null,
  dismiss = () => null,
  data,
  ...rest
}) => {
  if (!currency) return null
  if (data.loading) return <Loading />
  if (data.error) console.error(data.error)
  const { t } = useTranslation()
  const { me } = data
  const [addressCopied, setAddressCopied] = useState(false)
  const findWalletTicker = currency.ticker === 'USDT' ? 'ETH' : currency.ticker // TODO
  const wallet = me.wallets.find(wallet => wallet.type === findWalletTicker)
  const { address } = wallet
  const shortAddress = `${address.substring(0,9)}...${address.substring(address.length - 9)}`
  return (
    <div className="ModalContent ModalContentDepositCurrency">
      <div className="DepositCurrencyTitle">{t('DEPOSIT')}</div>
      <CurrencyIcon ticker={currency.ticker} style={{ height: '6em', width: '6em', marginTop: '1em' }} />
      <div className="DepositCurrencyTicker">{currency.ticker}</div>
      <QRCode className="ModalContentDepositCurrencyQRCode" text={address} />
      <div className="ModalContentDepositCurrencyAddressLinks">
        <div
          children={shortAddress}
          title={address}
          className="ModalContentDepositCurrencyAddress"
          onClick={() => {
            copy(address)
            setAddressCopied(true)
          }}
        />
        <MdLink onClick={() => {
          copy(address)
          setAddressCopied(true)
        }} />
      </div>
      {addressCopied ? <div>Copied!</div> : null}
      <Button className="ModalDepositCurrencyDoneButton" onClick={dismiss}>{t('DONE')}</Button>
      {children}
    </div>
  )
}

export default compose(
  graphql(gql`{
    me {
      id
      wallets {
        type
        address
      }
    }
  }`),
)(ModalContentDepositCurrency)
