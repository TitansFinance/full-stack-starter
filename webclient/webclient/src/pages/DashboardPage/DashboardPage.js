import React, { Component, useState, Suspense } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, graphql, Query, Subscription } from 'react-apollo'
import { pathOr, path } from 'ramda'
import gql from 'graphql-tag'
import cx from 'classnames'
import { FlagIcon } from 'react-flag-kit'
import {
  MdExpandMore,
  MdExpandLess,
  MdCheckCircle,
  MdArrowForward,
  MdMonetizationOn,
  MdInfoOutline,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'antd'

import history from '@/constructors/history'

import Button from '@/components/Button'
import Table from '@/components/Table'
import Card from '@/components/Card'
import Loading from '@/components/Loading'
import FeatureFlag from '@/components/FeatureFlag'

import './DashboardPage.sass'


const withQuery = compose(
  graphql(gql`{
    me {
      id
      username
      email
    }
    tenant {
      id
      name
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
)

const DashboardPageMobile = withQuery(({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const { me, tenant } = data

  document.title = `${tenant.name} - FullStackStarterKitTitle`

  return (
    <Suspense fallback={<Loading />}>
      <div className="Page DashboardPage">
      DashboardPage
      </div>
    </Suspense>
  )
})


const DashboardPageDesktop =  withQuery(({ data }) => {
  if (data.error) return console.error(data.error)
  if (data.loading) return <Loading />

  const { me, tenant } = data

  document.title = `${tenant.name} - Fund Projections`

  return (
    <Suspense fallback={<Loading />}>
      <div className="Page DashboardPage">
        <Row type="flex" justify="space-around">
          DashboardPageDesktop
        </Row>
      </div>
    </Suspense>
  )
})

export default {
  Mobile: DashboardPageMobile,
  Desktop: DashboardPageDesktop,
}

