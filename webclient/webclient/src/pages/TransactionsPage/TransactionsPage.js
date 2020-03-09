import React, { useState, Suspense, useEffect }from 'react'
import { compose, graphql, Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import ReactSelect from 'react-select'
import { useTranslation } from 'react-i18next'
import { path, pathOr, uniqWith } from 'ramda'

import Card from '@/components/Card'
import Table from '@/components/Table'
import TableRowTransaction from '@/components/TableRowTransaction'
import Loading from '@/components/Loading'

import './TransactionsPage.sass'

const CoinDetails = ({ ticker }) => {
  console.log('CoinDetails ticker: ', ticker)
  return null
}


const TableTransactions = (props) => {
  let { transactions, onTableScroll } = props
  const { t } = useTranslation()
  return (
    <Card
      className="TableTransactions TableCard"
      title={t('TransactionsPage.TableTransactions.title')}
    >
      <Table
        items={transactions}
        noMoreItemsText={t('No\ more\ transactions')}
        onTableScroll={onTableScroll}
      >
        {(props) => <TableRowTransaction {...props} />}
      </Table>
    </Card>
  )
}

const TransactionsPage = ({ data, location }) => {
  document.title = 'WalletAppTitle - Transactions'

  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const { t, i18n } = useTranslation()

  const allCurrenciesLabel = `${t('TransactionsPage.view')}: ${t('TransactionsPage.all-currencies')}`
  const currencyToCurrencyOption = currency => {
    if (!currency) {
      return {
        label: allCurrenciesLabel,
        value: null,
      }
    }
    return {
      label: `${t('TransactionsPage.view')}: ${currency.name}`,
      value: currency.ticker,
    }
  }

  const [selectedTicker, setSelectedTicker] = useState(pathOr(null, ['state', 'ticker'], location))

  // FIXME: React state will not update from the scroll event listener
  useEffect(() => { window.transactionsQueryOffset = 0 },
    () => { window.transactionsQueryOffset = 0 })

  const {
    me: { transactions },
    currencies,
  } = data

  const selectedCurrency = currencies.find(c => selectedTicker === c.ticker)

  const options = [
    currencyToCurrencyOption(null),
  ].concat(currencies.map(currency => currencyToCurrencyOption(currency)))

  return (
    <Suspense fallback={<Loading />}>
      <div className="Page TransactionsPage">
        <Query query={gql`
          query MyTransactions($tickers: [String], $offset: Int, $limit: Int) {
            me {
              id
              transactions(tickers: $tickers, offset: $offset, limit: $limit) {
                id
                transaction { status txHash }
                addressTo
                addressFrom
                amount
                createdAt
                updatedAt
                currency {
                  ticker
                  name
                }
              }
            }
          }`}
          variables={{ tickers: selectedTicker, offset: window.transactionsQueryOffset, limit: 20 }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (data.error) return console.error(data.error)
            if (data.loading) return <Loading />
            if (!data.me) return null
            const { transactions } = data.me
            if (!transactions) return null

            return (
              <div>
                <Suspense fallback={<div><Loading /></div>}>
                  <ReactSelect
                    className="TickerSelect"
                    value={currencyToCurrencyOption(selectedCurrency)}
                    onChange={selectedOption => {
                      console.log('setting selected', selectedOption.value)
                      setSelectedTicker(selectedOption.value)
                    }}
                    options={options}
                    optionClassName="needsclick"
                  />
                  <CoinDetails ticker={selectedTicker} />
                  <TableTransactions
                    transactions={transactions}
                    onTableScroll={(e, { end }) => {
                      if (end && !loading) {
                        window.transactionsQueryOffset += 1
                        fetchMore({
                          variables: {
                            tickers: selectedTicker,
                            offset: window.transactionsQueryOffset * 20,
                            limit: 20,
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            const updatedTransactions = uniqWith((a, b) => (a.id === b.id))([
                              ...prev.me.transactions,
                              ...fetchMoreResult.me.transactions,
                            ]).sort((a, b) => a.id < b.id)
                            if (updatedTransactions.length === prev.me.transactions.length) return prev
                            const updated = {
                              ...prev,
                              me: {
                                ...prev.me,
                                transactions: updatedTransactions,
                              },
                            }
                            return updated
                          }
                        })
                      }
                    }}
                  />
                </Suspense>
              </div>
            )
          }}
        </Query>
      </div>
    </Suspense>
  )
}

export default compose(
  graphql(gql`{
    me {
      id
      username
      accounts {
        balance
        currency {
          ticker
        }
      }
      portfolios {
        balance
        fund {
          name
        }
      }
      wallets {
        type
        balance
      }
      transactions(tickers: null, offset: 0, limit: 20) {
        id
        transaction { status txHash }
        addressTo
        addressFrom
        amount
        createdAt
        updatedAt
        currency {
          ticker
          name
        }
      }
    }
    funds {
      id
      name
      ticker
      assetsUnderManagement
      details
    }
    currencies {
      id
      ticker
      name
    }
    currentAverageExchangeRates(symbols: ["ETH/USDT", "BTC/USDT", "CNY/USD"]) {
      symbol
      rate
      numerator
      denominator
    }
  }`),
)(TransactionsPage)

