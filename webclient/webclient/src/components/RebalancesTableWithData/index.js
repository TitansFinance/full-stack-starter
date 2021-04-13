import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, Query } from 'react-apollo'
import { pathOr } from 'ramda'
import gql from 'graphql-tag'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Table as ADTable } from 'antd'
import moment from '@/constructors/moment'


const REBALANCES_QUERY = gql`
  query ExchangeRebalances {
    exchangeRebalances {
      _id
      amount
      currency
      fromExchange
      toExchange
      fromExchangeBalance
      toExchangeBalance
      timestamp
    }
  }
`




const RebalancesTableDesktop = ({
  items = [],
  loading,
}) => {
  const { t } = useTranslation()
  return (
    <div>
      <ADTable
        title={() => 'Exchange Rebalances'}
        columns={[
          {
            title: 'amount',
            dataIndex: 'amount',
            key: 'amount',
          },
          {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
          },
          {
            title: 'From',
            children: [
              {
                title: 'Exchange',
                dataIndex: 'fromExchange',
                key: 'fromExchange',
              },
              {
                title: 'Balance',
                dataIndex: 'fromExchangeBalance.total',
                key: 'fromExchangeBalance.total',
              },
            ],
          },
          {
            title: 'To',
            children: [
              {
                title: 'Exchange',
                dataIndex: 'toExchange',
                key: 'toExchange',
              },
              {
                title: 'Balance',
                dataIndex: 'toExchangeBalance.total',
                key: 'toExchangeBalance.total',
              },
            ],
          },
          {
            title: 'Date',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 100,
            render: (_, r, i) => moment(new Date(parseInt(r.timestamp))).fromNow(),
          },
        ]}
        dataSource={items}
        loading={loading}
        scroll={{ x: '1300' }}
        size={'middle'}
        bordered
        pagination={{
          position: 'bottom',
          pageSize: 20,
        }}
      />
    </div>
  )
}

const RebalancesTableWithDataDesktop = () => (
  <Query query={REBALANCES_QUERY}>
    {({ data, loading, ...result }) => {
      return (
        <RebalancesTableDesktop
          items={pathOr([], ['exchangeRebalances'], data)}
          loading={loading}
        />
      )
    }}
  </Query>
)

export default {
  Desktop: RebalancesTableWithDataDesktop,
}
