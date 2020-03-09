import React, { useState, useEffect, Suspense } from 'react'
import PropTypes from 'prop-types'
import * as log from 'loglevel'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  MdInsertChart,
  MdCompareArrows,
  MdTrendingUp,
  MdInput,
  MdUndo,
  MdSecurity,
  MdList,
  MdSettings,
  MdMailOutline,
  MdLibraryBooks,
  MdPeople,
  MdAccountBalance,
} from 'react-icons/md'
import gql from 'graphql-tag'
import { useTranslation } from 'react-i18next'

import apollo from '@/constructors/apollo'
import CurrentUserImage from '@/components/CurrentUserImage'
import CurrentUserHandle from '@/components/CurrentUserHandle'
import Loading from '@/components/Loading'

import './SideMenu.sass'


const logout = async ({ history }) => {
  await apollo.mutate({
    mutation: gql`
      mutation Logout {
        logout
      }
    `,
  })
  localStorage.removeItem('accessToken')
  await apollo.clearStore()
  history.replace('/login')
}


const SideMenuOption = withRouter((props) => {
  const {
    children,
    to,
    history,
    onClick,
    className,
    disabled = false,
    preview = false,
  } = props
  const { t } = useTranslation()
  const [active, setActive] = useState(props.active || to === history.location.pathname)
  return (
    <div
      onClick={async () => {
        if (disabled) return null
        if (preview) return null
        if (onClick) await onClick()
        if (to) history.push(to)
      }}
      className={cx({
        SideMenuOption: true,
        active,
        disabled: Boolean(disabled),
        preview: Boolean(preview),
        [className]: Boolean(className),
      })}
    >
      {children}
      {preview ? <span style={{ marginLeft: 'auto' }}>{`  (${t('Coming\ Soon')})`}</span> : null}
    </div>
  )
})

const SideMenuOptionGrouping = ({ children, className, ...rest }) => {

  return (
    <div className={cx({ SideMenuOptionGrouping: true }, (className || ''))} {...rest}>
      {children}
    </div>
  )
}


const SideMenu = connect(
  state => ({
    layout: state.layout,
  })
)(withRouter(({ dispatch, layout, history }) => {
  const { t } = useTranslation()
  const toggleMenu = (show = false) => {
    if (layout.showSidemenu === show) return null
    dispatch({
      type: 'LAYOUT_SHOW_SIDEBAR',
      payload: show,
    })
  }
  const toggleMenuAfterAnimation = (show = false) => {
    return new Promise((resolve, reject) => {
      toggleMenu(show)
      setTimeout(() => {
        resolve()
      }, 300)
    })
  }
  return (
    <Suspense fallback={<div><Loading /></div>}>
      <div className={cx({ SideMenu: true, show: layout.showSidebar })}>
        <nav className="SideMenuNav">
          <SideMenuOptionGrouping className="SideMenuOptionGroupingHeader" onClick={async () => {
            await toggleMenuAfterAnimation(false)
          }}>
            <CurrentUserImage className="SideMenuOptionIcon" />
            <CurrentUserHandle />
          </SideMenuOptionGrouping>
          <SideMenuOptionGrouping>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/'}><MdInsertChart className="SideMenuOptionIcon" /> {t('PageNames.Dashboard')}</SideMenuOption>
          </SideMenuOptionGrouping>
          <SideMenuOptionGrouping>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/transactions'}><MdCompareArrows className="SideMenuOptionIcon" /> {t('PageNames.Transactions')}</SideMenuOption>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/deposit'}><MdInput className="SideMenuOptionIcon" /> {t('PageNames.Deposit')}</SideMenuOption>
            <SideMenuOption preview onClick={async () => toggleMenuAfterAnimation(false)} to={'/funds'}><MdTrendingUp className="SideMenuOptionIcon" /> {t('PageNames.Funds')}</SideMenuOption>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/loancalculator'}><MdAccountBalance className="SideMenuOptionIcon" /> {t('PageNames.Loan\ Calculator')}</SideMenuOption>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/withdraw'}><MdUndo className="SideMenuOptionIcon" /> {t('PageNames.Withdraw')}</SideMenuOption>
          </SideMenuOptionGrouping>
          <SideMenuOptionGrouping>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/settings/user/profile'}><MdList className="SideMenuOptionIcon" /> {t('PageNames.Profile')}</SideMenuOption>
            <SideMenuOption preview onClick={async () => toggleMenuAfterAnimation(false)} to={'/settings/user/security'}><MdSecurity className="SideMenuOptionIcon" /> {t('PageNames.Security')}</SideMenuOption>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/settings/user/general'}><MdSettings className="SideMenuOptionIcon" /> {t('PageNames.Settings')}</SideMenuOption>
          </SideMenuOptionGrouping>
          <SideMenuOptionGrouping>
            <SideMenuOption onClick={async () => toggleMenuAfterAnimation(false)} to={'/notifications'}><MdMailOutline className="SideMenuOptionIcon" /> {t('PageNames.Notifications')}</SideMenuOption>
          </SideMenuOptionGrouping>
          <SideMenuOptionGrouping>
            <SideMenuOption preview onClick={async () => toggleMenuAfterAnimation(false)} to={'/about'}><MdPeople className="SideMenuOptionIcon" /> {t('PageNames.About\ Us')}</SideMenuOption>
            <SideMenuOption preview onClick={async () => toggleMenuAfterAnimation(false)} to={'/legal'}><MdLibraryBooks className="SideMenuOptionIcon" /> {t('PageNames.Legal')}</SideMenuOption>
          </SideMenuOptionGrouping>
          <SideMenuOptionGrouping>
            <SideMenuOption onClick={async () => {
              await logout({ history })
              toggleMenuAfterAnimation(false)
            }}><MdPeople className="SideMenuOptionIcon" /> {t('SideMenu.Log\ Out')}</SideMenuOption>
          </SideMenuOptionGrouping>
        </nav>
        <div className="SideMenuBackdrop" onClick={() => toggleMenu(false)}></div>
      </div>
    </Suspense>
  )
}))

export default SideMenu
