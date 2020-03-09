import React, { Component, useState, Suspense } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, graphql, Query, Mutation, Subscription } from 'react-apollo'
import { pathOr, path } from 'ramda'
import gql from 'graphql-tag'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  Row,
  Col,
  Checkbox,
  Input,
  InputNumber,
  Tooltip,
  Table as ADTable,
  Button,
  Tag,
  Select,
} from 'antd'

import history from '@/constructors/history'
import moment from '@/constructors/moment'

import Loading from '@/components/Loading'
import FeatureFlag from '@/components/FeatureFlag'

const DAEMON_CONFIG_QUERY = gql`
  query DaemonConfig ($fundId: Int!, $type: String!) {
    daemonConfig(fundId: $fundId, type: $type)
  }
`

const DAEMON_RUNS_QUERY = gql`
  query DaemonRuns ($fundId: Int!, $type: String!) {
    daemonRuns(fundId: $fundId, type: $type)
  }
`

const DAEMON_CONFIG_SUBSCRIPTION = gql`
  subscription DaemonConfigUpdatedSubscription($fundId: Int!, $type: String!) {
    daemonConfigUpdated(fundId: $fundId, type: $type)
  }
`


const SEND_DAEMON_COMMAND_MUTATION = gql`
  mutation SendDaemonCommand(
    $command: String,
    $options: JSON,
    $timestamp: String,
    $fundId: Int,
    $daemonType: String
  ) {
    sendDaemonCommand(
      command: $command,
      options: $options,
      timestamp: $timestamp,
      fundId: $fundId,
      daemonType: $daemonType
    )
  }
`


const withQuery = compose(
  graphql(gql`{
    me {
      id
      username
      email
    }
    funds {
      id
      name
      ticker
      assetsUnderManagement
      details
    }
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD"]) {
      symbol
      rate
      numerator
      denominator
    }
    tenant {
      _id
      tenantId
      name
      domains
      arbitrageEnabled
      branding {
        brandingIconUrl
        logoUrl
        faviconUrl
        colorPrimary
        fontColorPrimary
        colorSecondary
        fontColorSecondary
        colorTertiary
        fontColorTertiary
      }
      authRequireMFA
      authRequireEmail
      authRequirePhone
      authMfaEnabled
      authPrimaryIdentifier
    }
    exchanges {
      exchange
      balances
      balanceHistory
    }
  }`)
)


const FundAdminPageMobile = withQuery(({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const {
    me,
    funds,
    portfolios,
    tenant,
    exchanges,
  } = data

  document.title = `${tenant.name} - Fund Admin`

  return (
    <Suspense fallback={<Loading />}>
      <div className="Page FundAdminPage">
        <h2>Admin</h2>
        <p>Coming soon...</p>
      </div>
    </Suspense>
  )
})


const FundAdminPageDesktop = withQuery(({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const {
    me,
    funds,
    tenant,
    exchanges,
  } = data

  const fundId = 1
  const daemonType = 'arbitrage'
  const [rebalanceFrom, setRebalanceFrom] = useState(null)
  const [rebalanceTo, setRebalanceTo] = useState(null)
  const [rebalanceCurrency, setRebalanceCurrency] = useState('BTC')
  const [rebalanceAmount, setRebalanceAmount] = useState('')
  const [daemonConfigOpen, setDaemonConfigOpen] = useState(false)

  document.title = `${tenant.name} - Fund Admin`
  console.log('exchanges: ', exchanges)
  return (
    <Suspense fallback={<Loading />}>
      <div className="Page FundAdminPage">
        <h2>Admin</h2>
        <Query
          query={DAEMON_CONFIG_QUERY}
          variables={{ fundId, type: daemonType }}
        >
          {({ data, loading, error }) => {
            if (error) console.error(error)
            if (loading) return <Loading />
            console.log('data: ', data)
            if (!data) return '--'
            let { daemonConfig } = data
            return (
              <Subscription
                subscription={DAEMON_CONFIG_SUBSCRIPTION}
                variables={{ fundId, type: daemonType }}
              >
                {({ data, loading, error }) => {
                  if (error) console.error(error)
                  if (loading) console.log('loading...')
                  if (!daemonConfig) return <Loading />
                  daemonConfig = pathOr(daemonConfig, ['daemonConfigUpdated', 'daemonConfig'], data)
                  console.log('DAEMON_CONFIG_SUBSCRIPTION: ', daemonConfig)
                  const {
                    status,
                  } = daemonConfig
                  return (
                    <>
                      <Row>
                        <Col span={4}>
                          <Mutation mutation={SEND_DAEMON_COMMAND_MUTATION}>
                            {(mutation, info, ...rest) => {
                              return (
                                <>
                                  <Button onClick={() => {
                                    mutation({
                                      variables: {
                                        command: 'start',
                                        options: null,
                                        timestamp: new Date().getTime().toString(),
                                        fundId,
                                        daemonType,
                                      },
                                    })
                                  }}>Start</Button>
                                  <Button onClick={() => {
                                    mutation({
                                      variables: {
                                        command: 'stop',
                                        options: null,
                                        timestamp: new Date().getTime().toString(),
                                        fundId,
                                        daemonType,
                                      },
                                    })
                                  }}>Stop</Button>
                                </>
                              )
                            }}
                          </Mutation>
                        </Col>
                        <Col span={4}>
                          <Mutation mutation={SEND_DAEMON_COMMAND_MUTATION}>
                            {(mutation, info, ...rest) => {
                              return (
                                <>
                                  From
                                  <Select
                                    value={rebalanceFrom}
                                    placeholder={'From'}
                                    style={{ width: '100%' }}
                                    onChange={(v) => setRebalanceFrom(v)}
                                  >
                                    {daemonConfig.exchanges.map(({ key }, i) => (
                                      <Select.Option key={i} value={key}>{key}</Select.Option>
                                    ))}
                                  </Select>
                                  To
                                  <Select
                                    value={rebalanceTo}
                                    placeholder={'To'}
                                    notFoundContent={null}
                                    style={{ width: '100%' }}
                                    onChange={(v) => setRebalanceTo(v)}
                                  >
                                    {daemonConfig.exchanges.map(({ key }, i) => (
                                      <Select.Option key={i} value={key}>{key}</Select.Option>
                                    ))}
                                  </Select>
                                  Amount
                                  <Input
                                    value={rebalanceAmount}
                                    placeholder={'Amount'}
                                    onChange={(e) => setRebalanceAmount(e.target.value)}
                                    addonAfter={
                                      <Select
                                        value={rebalanceCurrency}
                                        style={{ width: 100 }}
                                        onChange={(v) => setRebalanceCurrency(v)}
                                      >
                                        <Select.Option value="BTC">BTC</Select.Option>
                                        <Select.Option value="USDT">USDT</Select.Option>
                                      </Select>
                                    }
                                  />
                                  <Button
                                    children={'Rebalance'}
                                    onClick={() => {
                                      mutation({
                                        variables: {
                                          command: 'rebalance',
                                          options: {
                                            to: rebalanceTo,
                                            from: rebalanceFrom,
                                            amount: rebalanceAmount,
                                            currency: rebalanceCurrency,
                                          },
                                          timestamp: new Date().getTime().toString(),
                                          fundId,
                                          daemonType,
                                        },
                                      })
                                    }}
                                    disabled={!(
                                      rebalanceTo && rebalanceFrom
                                      && rebalanceAmount && rebalanceCurrency
                                      && rebalanceTo !== rebalanceFrom
                                    )}
                                  />
                                </>
                              )
                            }}
                          </Mutation>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <div style={{ fontSize: '0.8em' }}>
                            <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
                            <pre>
                              <Button onClick={() => setDaemonConfigOpen(!daemonConfigOpen)}>
                                {daemonConfigOpen ? 'Hide' : 'Show'} Daemon Config
                              </Button>
                              <div>
                                {daemonConfigOpen ? JSON.stringify(daemonConfig, null, 2) : null}
                              </div>
                            </pre>
                          </div>
                        </Col>
                        <Col span={24}>
                          <Query
                            query={DAEMON_RUNS_QUERY}
                            variables={{ fundId, type: daemonType }}
                          >
                            {({ data, loading, error }) => {
                              if (error) console.error(error)
                              if (loading) return <Loading />
                              if (!data) return '--'
                              console.log('DAEMON_RUNS_QUERY data', data)
                              const { daemonRuns } = data
                              return (
                                <div style={{ fontSize: '0.8em' }}>
                                  <ADTable
                                    pagination={{
                                      position: 'bottom',
                                      pageSize: 5,
                                    }}
                                    title={() => 'Daemon Runs'}
                                    columns={[
                                      {
                                        title: 'Run',
                                        dataIndex: '_id',
                                        key: '_id',
                                        render: (_, r, i) => {
                                          return (
                                            <div key={`_id_${i}`}>
                                              <div>{r._id}, fund {r.fundId}</div>
                                              <div>{r.type}</div>
                                              <div>{moment(new Date(parseInt(r.timestart))).fromNow()} -> {r.timestop ? moment(new Date(parseInt(r.timestop))).fromNow() : 'In progress'}</div>
                                            </div>
                                          )
                                        },
                                      },
                                      {
                                        title: 'Rebalances',
                                        dataIndex: 'rebalances',
                                        key: 'rebalances',
                                        render: (_, r, i) => {
                                          const { rebalances, ...rest } = r
                                          return rebalances ? rebalances.map(({ toExchange, fromExchange, amount, currency }, i) => (
                                            <div key={`rebalances_${i}`} style={{ borderBottom: '1px solid gray' }}>{amount} {currency} ({fromExchange} => {toExchange})</div>
                                          )) : null
                                        },
                                      },
                                      {
                                        title: 'Orders',
                                        dataIndex: 'orders',
                                        key: 'orders',
                                        render: (_, r, i) => {
                                          const { orders, ...rest } = r
                                          return orders ? orders.map(({ exchangeKey, side, quantity, price, ...raw }, i) => (
                                            exchangeKey ? /* is Order */ (
                                              <div key={`orders_a_${i}`} style={{ borderBottom: '1px solid gray' }}>
                                                {side} {quantity} @ ${price} ({exchangeKey})
                                              </div>
                                            ) : /* is RawOrder */ (
                                              <div key={`orders_b_${i}`} style={{ borderBottom: '1px solid gray' }}>
                                                {raw.buyExchange}/{raw.sellExchange}: ${raw.spread} {raw.percentSpread * 100}%
                                              </div>
                                            )
                                          )) : null
                                        },
                                      },
                                      {
                                        title: 'Start Balances',
                                        dataIndex: 'startBalances',
                                        key: 'startBalances',
                                        render: (_, r, i) => (
                                          path(['startBalances', 'total'], r) ? Object.entries(r.startBalances.total).map(([currency, value]) => (
                                            <div key={`startBalances_${i}`}>{currency}: {value}</div>
                                          )) : null
                                        ),
                                      },
                                      {
                                        title: 'Stop Balances',
                                        dataIndex: 'stopBalances',
                                        key: 'stopBalances',
                                        render: (_, r, i) => (
                                          path(['stopBalances', 'total'], r) ? Object.entries(r.stopBalances.total).map(([currency, value]) => (
                                            <div key={`stopBalances_${i}`}>{currency}: {value}</div>
                                          )) : null
                                        ),
                                      },
                                    ]}
                                    dataSource={daemonRuns}
                                    loading={loading}
                                    scroll={{ x: '1300' }}
                                    size={'small'}
                                    bordered
                                  />
                                </div>
                              )
                            }}
                          </Query>
                        </Col>
                      </Row>
                    </>
                  )
                }}
              </Subscription>
            )
          }}
        </Query>
      </div>
    </Suspense>
  )
})

export default {
  Mobile: FundAdminPageMobile,
  Desktop: FundAdminPageDesktop,
}

