import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import cx from 'classnames'

import './Link.sass'

const Link = ({ children, className, ...rest }) => (
  <RouterLink className={cx({
    Link: true,
    [className]: Boolean(className),
  })} {...rest}>
    {children}
  </RouterLink>
)

export default Link
