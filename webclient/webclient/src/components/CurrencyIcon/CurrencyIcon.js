import React from 'react'
import cx from 'classnames'
import { MdMonetizationOn } from 'react-icons/md'
import { path } from 'ramda'

import './CurrencyIcon.sass'

const CurrencyIcon = ({
  ticker,
  className,
  children = null,
  ...rest
}) => {
  if (!ticker) return <img src={'/static/images/tickers/other@2x.png'} alt="Currency Icon" />
  return (
    <img
      className={cx({ CurrencyIcon: true, [className]: Boolean(className) })}
      src={process.env.FRONTEND_GATEWAY_URL + `/static/images/tickers/${ticker}@2x.png`}
      alt={ticker}
      {...rest}
    />
  )
}

export default CurrencyIcon
