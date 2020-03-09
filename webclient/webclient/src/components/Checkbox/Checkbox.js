import React, { useState } from 'react'
import cx from 'classnames'

import './Checkbox.sass'

const Checkbox = ({
  className = null,
  checked = false,
  before = null,
  after = null,
  children,
  ...rest
}) => {
  return (
    <div
      className={cx({
        Checkbox: true,
        checked: Boolean(checked),
        [className]: Boolean(className),
      })}
      {...rest}
    >
      {before}
      <i className="checkIcon"></i>
      {after}
      {children}
    </div>
  )
}

export default Checkbox
