import React, { Component } from 'react'
import cx from 'classnames'

import './Row.sass'

const Row = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={cx({ Row: true, [className]: Boolean(className) })} {...rest}>
      {children}
    </div>
  )
}

export default Row
