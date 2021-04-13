import React from 'react'
import { withRouter } from 'react-router'
import cx from 'classnames'
import { path } from 'ramda'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import './Logo.sass'



const Logo = ({
  history,
  className,
  children = null,
  imageUrl = '',
  type = 'logo',
  staticContext,
  data,
  ...rest
}) => {
  if (data.loading) return null
  let src = type === 'logo' ? path(['tenant', 'branding', 'logoUrl'], data) : path(['tenant', 'branding', 'brandingIconUrl'], data)

  return (
    <img
      src={src || '/static/images/logo@2x.png'}
      alt="logo"
      className={cx({ Logo: true, [className]: Boolean(className) })}
      {...rest}
    />
  )
}

export default compose(
  graphql(gql`{
    tenant {
      id
      slug
      domains
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
  }`)
)(withRouter(Logo))
