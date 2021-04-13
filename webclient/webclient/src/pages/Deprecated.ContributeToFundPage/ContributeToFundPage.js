import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose, graphql } from 'react-apollo'
import { pathOr } from 'ramda'
import gql from 'graphql-tag'
import ReactSelect from 'react-select'

import history from '@/constructors/history'
import Row from '@/components/Row'
import Loading from '@/components/Loading'
import './ContributeToFundPage.sass'

const SUPPORTED_CURRENCIES = [
  'BTC',
  'ETH',
  'USDT',
  // ...
]

const ContributeTypeListItem = ({ fund, type }) => {
  return (
    <Row
      className="ContributeTypeListItem RowListItem"
      onClick={e => history.push(`/funds/${fund.id}/contribute/${type}`)}
    >
      {type}
    </Row>
  )
}

// const ContributeTypeList = ({ fund, types }) => {
//   const content = types.map((type, i) => <ContributeTypeListItem key={i} fund={fund} type={type} />)
//   return (
//     <div className="ContributeTypeList">
//       Select contribution currency:
//       {content}
//     </div>
//   )
// }

const findFundById = (funds, id) => funds.find(f => parseInt(f.id, 10) === parseInt(id, 10))

const ContributeToFundPage = (props) => {
  const { history, data, match } = props
  document.title = 'WalletAppTitle - ContributeToFundPage'
  if (data.loading) return <Loading />
  const { me, funds } = data
  const fund = findFundById(funds, match.params.id)
  if (!fund) return 'Error'

  const [type, setType] = useState('BTC')

  const userFundedWallets = (me.wallets.find(w => w.balance > 0))
  let content = null
  if (!userFundedWallets) {
    content = <Link to={'/'}>Fund your wallet</Link>
  } else {
    content = (
      <ReactSelect
        placeholder="Select currency"
        value={type}
        onChange={selected => setType(selected)}
        options={userFundedWallets.map(o => ({
          label: o.type,
          value: o.type,
        }))}
        components={{ Option: CustomOption }}
      />
    )
  }

  return (
    <div className="ContributeToFundPage">
      <div>{fund.name}</div>
      <div>{fund.balance} Assets Under Management</div>
      <div>[7.51%] YTD</div>
      {content}
    </div>
  )
}

export default compose(
  graphql(gql`{
    me {
      id
      firstName
      portfolios { balance }
      wallets { type }
    }
    funds { id name balance currency }
  }`),
)(withRouter(ContributeToFundPage))
