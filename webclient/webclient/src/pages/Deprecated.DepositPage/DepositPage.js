import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Query, compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { pathOr } from 'ramda'

import history from '@/constructors/history'
import Loading from '@/components/Loading'
import './DepositPage.sass'


const ETH_TOKENS = [
  'USDT',
]

const DepositPage = (props) => {
  const { history, data, match } = props
  const { type } = match.params
  document.title = 'WalletAppTitle - DepositPage'

  if (data.loading) return <Loading />
  if (data.error) return 'an error occurred'
  const { me } = data
  // console.log(props, data)
  const { wallets } = me
  const findWallet = walletType => wallets.find(wallet => wallet.type === walletType)
  const wallet = ETH_TOKENS.includes(type) ? findWallet('ETH') : findWallet(type)

  if (!wallet) return 'Error'

  console.log(type, me.wallets)

  return (
    <div className="DepositPage">
      Deposit {type}
      <div>
        <p>Send {type} to this address:</p>
        <p>{wallet.address}</p>
        Note: only send {type} to this addres... not responsible for lost currencies.
      </div>
    </div>
  )
}

export default compose(
  graphql(gql`{
    me {
      id
      firstName
      portfolios { balance }
      wallets { address type }
    }
    funds { id name balance currency }
  }`),
)(withRouter(DepositPage))
