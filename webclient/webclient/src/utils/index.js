import getSymbolFromCurrency from 'currency-symbol-map'
import web3 from '@/constructors/web3'
const { path, pathOr } = require('ramda')


/* I = Prn */
export const calculateSimpleLoanInterest = ({
  principle,
  duration,
  interestRate,
}) => {
  if (!principle || !duration || !interestRate) return 0
  switch (duration) {
    case 'day':
      return principle * interestRate / 365
    case 'month':
      return principle * interestRate / 12
    case 'year':
      return principle * interestRate
    default: // no-op
  }
}

export const capitalize = str => {
  return `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`
}

export const tickerIsERC20 = (ticker) => {
  return ['USDT'].includes(ticker)
}

export const userWalletForCurrency = (wallets, ticker) => {
  switch (ticker) {
    case 'BTC':
      return wallets.find(wallet => wallet.type === ticker)
    case 'ETH':
      return wallets.find(wallet => wallet.type === 'ETH')
    default:
      return tickerIsERC20(ticker) ? wallets.find(wallet => wallet.type === 'ETH') : null
  }
}

export const shortAddress = (addr) => addr ? (
  `${addr.substring(0, 6)}...${addr.substring(addr.length - 6, addr.length - 1)}`
) : ''


export const pageNameFromPathname = (pathname, isPublic = false) => {
  if (pathname.match(/funds\/(.*)\/projections/)) return 'Fund Projections'
  if (pathname.match(/funds\/(.*)\/admin/)) return 'Fund Admin'
  switch (pathname) {
    case '/': return isPublic ? 'Home' : 'Dashboard'
    case '/login': return 'Login'
    case '/register': return 'Register'
    case '/resetpassword': return 'Reset\ Password'
    case '/loancalculator': return 'Loan\ Calculator'
    case '/transactions': return 'Transactions'
    case '/settings/user/general': return 'Settings'
    case '/settings/user/profile': return 'Profile'
    case '/settings/user/security': return 'Security'
    case '/deposit': return 'Deposit'
    case '/funds': return 'Funds'
    case '/withdraw': return 'Withdraw'
    case '/notifications': return 'Notifications'
    case '/about': return 'About'
    case '/legal': return 'Legal'
    default: return null
  }
}

export const getErrorKey = error => {
  const graphqlNetworkMessages = path(['graphQLErrors', 0, 'message'], error)
  if (graphqlNetworkMessages) return graphqlNetworkMessages
  if (pathOr('', ['message'], error).indexOf('Network error') !== -1) return 'errors.network.generic'
  return 'errors.generic'
}

export const standardUnitFromBaseUnit = (baseUnitValue, ticker) => {
  let value = baseUnitValue
  switch(ticker) {
    case 'BTC':
      value = baseUnitValue / 100000000 // TODO
      break
    case 'ETH':
      value = web3.utils.fromWei(baseUnitValue.toString())
      break
    case 'USDT':
      value = web3.utils.fromWei(baseUnitValue.toString(), 'mwei')
    default: // no-op
  }
  return value
}

export const isUSDStableCoinTicker = (ticker) => (['USD', 'USDT'].includes(ticker))
const tickersMatch = (a, b) => {
  if (a === b) return true
  if (isUSDStableCoinTicker(a) && isUSDStableCoinTicker(b)) return true
  return false
}
export const rateForTickers = (rates, fromTicker, toTicker) => {
  if (tickersMatch(fromTicker, toTicker)) return 1

  const valuePerToTicker = rates.find(({ numerator, denominator }) => (
    tickersMatch(numerator, toTicker) && tickersMatch(denominator, fromTicker)
  ))
  if (valuePerToTicker && valuePerToTicker.rate) return valuePerToTicker.rate
  const valueInFromTicker = rates.find(({ numerator, denominator }) => (
    tickersMatch(denominator, toTicker) && tickersMatch(numerator, fromTicker)
  ))
  if (valueInFromTicker && valueInFromTicker.rate) return 1 / valueInFromTicker.rate

  return false
}

export const convertCurrency = (rates, value, fromTicker, toTicker) => {
  const rate = rateForTickers(rates, fromTicker, toTicker)
  return rate ? (rate * value) : null
}

export const getValue = ({
  rates,
  value,
  valueCurrency,
  targetCurrency,
  toFixed,
}) => {
  if (!rates) return null
  if (value === undefined) return null
  if (typeof valueCurrency !== 'string') return null
  if (typeof targetCurrency !== 'string') targetCurrency = 'USD'
  const floatValue = parseFloat(value, 10)
  if (typeof floatValue !== 'number' || isNaN(floatValue)) return null
  // If value is not USD, convert to USD
  const USDValue = convertCurrency(rates, floatValue, valueCurrency, 'USD')
  // Convert USD value to targetCurrency
  const convertedValue = convertCurrency(rates, USDValue, 'USD', targetCurrency)
  return {
    value: toFixed ? convertedValue.toFixed(toFixed) : convertedValue,
    sign: getSymbolFromCurrency(targetCurrency),
    symbol: targetCurrency,
  }
}

export const getValues = ({
  rates,
  values,
  targetCurrency,
}) => {
  if (!values.length) return 0

  console.log('rates', rates)
  console.log('values', values)
  console.log('targetCurrency', targetCurrency)

  return values.reduce((a, b) => {
    const { ticker } = b.currency
    return (a + getValue({
      rates,
      value: standardUnitFromBaseUnit(b.balance, ticker),
      valueCurrency: ticker,
      targetCurrency,
    }).value)
  }, 0)
}
