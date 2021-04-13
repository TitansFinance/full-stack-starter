import React, { useState } from 'react'
import { Query, Mutation, compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import ReactSelect from 'react-select'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Loading from '@/components/Loading'

import './FundPage.sass'

const FundInfo = ({ fund }) => {
  return (
    <div className="FundInfo">
      <div>
        <div>{fund.name}</div>
        <div>{fund.performance || '[[7.5% YTD]]'}</div>
      </div>
      <div>
        Assets
        <div>{fund.balance} {fund.currency}</div>
      </div>
    </div>
  )
}

const findFundById = (funds, id) => funds.find(f => parseInt(f.id, 10) === parseInt(id, 10))

const FundPage = ({ data, match, history }) => {
  const [type, setType] = useState('BTC')
  const [amount, setAmount] = useState(0)

  if (data.loading) return 'loading...'
  const { me, funds } = data
  const fund = findFundById(funds, match.params.id)


  let userFundedWallets = (me.wallets.filter(w => w.balance > 0))
  console.log(fund, userFundedWallets)
  let content = null
  if (!userFundedWallets) {
    content = <Button onClick={() => history.push('/')}>Fund your wallets</Button>
  } else {
    console.log(type)
    const { balance } = userFundedWallets.find(w => w.type === type)
    content = (
      <Mutation mutation={gql`
        mutation SendContributionToFund($fundId: Int, $currency: String, $amount: Float) {
          sendContributionToFund(fundId: $fundId, currency: $currency, amount: $amount) {
            balance
          }
        }
      `}>
        {(sendContributionToFundMutation, { error, loading, data }) => {
          if (loading) return <Loading />
          if (error) console.error(error)
          return (
            <div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                Amount: <Input style={{ width: '30px' }} type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
                / {balance}
                <ReactSelect
                  placeholder="Select currency"
                  value={{ label: type, value: type }}
                  onChange={selected => setType(selected.value)}
                  options={userFundedWallets.map(opt => ({
                    label: opt.type,
                    value: opt.type,
                  }))}
                />
              </div>
              <Button disabled={!amount} onClick={async () => {
                console.log('fund it, amt: ', amount)
                const account = await sendContributionToFundMutation({
                  variables: { fundId: parseInt(fund.id, 10), currency: type, amount: parseFloat(amount) },
                })
                console.log('done: acocunt: ', account)
              }}>Fund</Button>
            </div>
          )
        }}
      </Mutation>
    )
  }

  console.log(content)

  return (
    <div className="FundPage">
      <div>
        <FundInfo fund={fund} />
        {content}
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
      wallets { type balance }
    }
    funds { id name balance currency }
  }`),
)(withRouter(FundPage))

{/* <FundTransactionHistory fund={fund} /> */}
// const FundTransactionHistory = ({ transactions }) => {
//   transactions = [
//     {
//       entity: 'Starbucks',
//       status: 'PROCESSING',
//       currency: 'USD',
//       updatedAt: new Date().toDateString(),
//       amount: 14.00,
//     },
//     {
//       entity: 'Spotify',
//       status: 'PROCESSED',
//       currency: 'USD',
//       updatedAt: new Date().toDateString(),
//       amount: 214.77,
//     },
//     {
//       entity: 'JMP Business Systems',
//       status: 'PROCESSED',
//       currency: 'USD',
//       updatedAt: new Date().toDateString(),
//       amount: 5214.64,
//     },
//     {
//       entity: 'INTL WIRE 147131',
//       status: 'PROCESSED',
//       currency: 'USD',
//       updatedAt: new Date().toDateString(),
//       amount: 25214.99,
//     },
//     {
//       entity: 'CHK CASH DEPOSIT',
//       status: 'PROCESSED',
//       currency: 'USD',
//       updatedAt: new Date().toDateString(),
//       amount: 125214.38,
//     },
//   ]

//   const content = transactions.map((tx, i) => (
//     <div key={i} className="FundTransactionHistoryRow">
//       <div>
//         <div>{tx.status === 'PROCESSING' ? `${tx.status} ` : null}{tx.updatedAt}</div>
//         <div>{tx.entity}</div>
//       </div>
//       <div>${tx.amount} {tx.currency}</div>
//     </div>
//   ))

//   return (
//     <div className="FundTransactionHistory">
//       Recent Transactions
//       {content}
//     </div>
//   )
// }
