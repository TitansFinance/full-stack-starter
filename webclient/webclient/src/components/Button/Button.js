import React, { Component } from 'react'
import cx from 'classnames'

import './Button.sass'

const Button = ({ children, onClick = () => {}, className, disabled, ...rest }) => (
  <button
    onClick={() => {
      if (!disabled) onClick()
    }}
    className={cx({
      Button: true,
      Disabled: Boolean(disabled),
      [className]: Boolean(className),
    })}
    {...rest}
    children={children}
  />
)

export default Button
