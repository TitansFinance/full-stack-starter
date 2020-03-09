import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as log from 'loglevel'
import { Link, withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import {
  MdMenu,
  MdNotificationsActive,
  MdNotificationsNone,
  MdChevronLeft,
} from 'react-icons/md'
const { useTranslation } = require('react-i18next')

import history from '@/constructors/history'
import Logo from '@/components/Logo'
import { pageNameFromPathname } from '@/utils'

import './Header.sass'


const Center = ({ location, isPublic = false }) => {
  const { t } = useTranslation()
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Logo
        type={'icon'}
        style={{
          height: '1em',
          width: '1em',
          marginRight: '0.5em',
        }}
      />
      <span style={{ lineHeight: '1em' }}>{t(`PageNames.${pageNameFromPathname(location.pathname, isPublic)}`)}</span>
    </div>
  )
}

const PublicHeader = withRouter(
  ({ location, history }) => {
    const { t } = useTranslation()
    const leftIcon = ['/', '/login'].includes(location.pathname) ? null : <MdChevronLeft className="BackButton" onClick={history.goBack} />
    return (
      <header className="Header">
        {leftIcon}
        <Center location={location} isPublic />
      </header>
    )
  }
)


const PrivateHeader = graphql(gql`{
  me {
    id
    notifications {
      read
    }
  }
}`)(
  connect()(withRouter(
    ({ dispatch, loading, error, data, location }) => {
      const { t } = useTranslation()
      if (loading) return null
      if (error) {
        console.error(error)
        return null
      }
      if (!data.me) return null

      const { me: { notifications } } = data

      const leftIcon = <MdMenu className="MobileHeaderIcon MobileHeaderLeftIcon" onClick={() => dispatch({
        type: 'LAYOUT_SHOW_SIDEBAR',
        payload: true,
      })} />
      const unreadNotifications = notifications ? notifications.filter(n => !n.read) : []
      const IconType = unreadNotifications.length ? MdNotificationsActive : MdNotificationsNone
      const rightIcon = <IconType
        className="MobileHeaderIcon MobileHeaderRightIcon"
        onClick={() => history.push('/notifications')}
      />

      return (
        <header className="Header">
          {leftIcon}
          <Center location={location} />
          {rightIcon}
        </header>
      )
    }
  ))
)

const DesktopPrivateHeader = graphql(gql`{
  me {
    id
    notifications {
      read
    }
  }
}`)(
  connect()(withRouter(
    ({ dispatch, loading, error, data, location }) => {
      const { t } = useTranslation()
      if (loading) return null
      if (error) {
        console.error(error)
        return null
      }
      if (!data.me) return null

      const { me: { notifications } } = data

      return (
        <header className="Header">
          <div>
            <Logo
              type={'icon'}
              style={{
                height: '1em',
                width: '1em',
                marginRight: '0.5em',
                display: 'inline',
              }}
              onClick={() => history.push('/')}
            />
            <span style={{ lineHeight: '1em' }}>{t(`PageNames.${pageNameFromPathname(location.pathname, false)}`)}</span>
          </div>
          <div>
            <Link to={'/'}>Dashboard</Link>
            <span> | </span>
            <Link to={'/funds/1/projections'}>Fund Projections</Link>
            <span> | </span>
            <Link to={'/funds/1/admin'}>Fund Admin</Link>
          </div>
        </header>
      )
    }
  ))
)

export default {
  Mobile: {
    Public: PublicHeader,
    Private: PrivateHeader,
  },
  Desktop: {
    Public: () => null,
    Private: DesktopPrivateHeader,
  },
}
