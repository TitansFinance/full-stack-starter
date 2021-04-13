import React, { Component, PureComponent, Suspense } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'

import LoadingPage from '@/pages/LoadingPage'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SideMenu from '@/components/SideMenu'
import Modal from '@/components/Modal'

import './Layout.sass'

@connect(
  state => ({
    layout: state.layout,
  })
)
class Layout extends PureComponent {
  render() {
    const { layout } = this.props
    return (
      <div
        className={cx({
          Layout: true,
          Mobile: layout.mobile,
          Tablet: layout.tablet,
          Desktop: layout.desktop,
        }, this.props.className || '')}
      >
        {this.props.children}
      </div>
    )
  }
}

@connect(
  state => ({
    layout: state.layout,
  })
)
class MobilePublic extends PureComponent {
  render() {
    const { layout } = this.props
    return (
      <Layout className="Public">
        <Header.Mobile.Public />
        <div className="Main">
          {this.props.children}
        </div>
        <Footer.Mobile.Public />
        <Modal />
      </Layout>
    )
  }
}

@connect(
  state => ({
    layout: state.layout,
  })
)
class MobilePrivate extends PureComponent {
  render() {
    const { layout } = this.props
    return (
      <Layout className="Private">
        <Suspense fallback={<LoadingPage />}>
          <SideMenu show={layout.showSidebar} />
          <Header.Mobile.Private />
          <div className="Main">
            {this.props.children}
          </div>
          <Footer.Mobile.Private />
          <Modal />
        </Suspense>
      </Layout>
    )
  }
}


@connect(
  state => ({
    layout: state.layout,
  })
)
class DesktopPublic extends PureComponent {
  render() {
    const { layout } = this.props
    return (
      <Layout className="Public">
        <Header.Desktop.Public />
        <div className="Main">
          {this.props.children}
        </div>
        <Footer.Desktop.Public />
        <Modal />
      </Layout>
    )
  }
}

@connect(
  state => ({
    layout: state.layout,
  })
)
class DesktopPrivate extends PureComponent {
  render() {
    const { layout } = this.props
    return (
      <Layout className="Private">
        <Suspense fallback={<LoadingPage />}>
          <Header.Desktop.Private />
          <div className="Main">
            {this.props.children}
          </div>
          <Footer.Desktop.Private />
        </Suspense>
      </Layout>
    )
  }
}


export default {
  Desktop: {
    Private: DesktopPrivate,
    Public: DesktopPublic,
  },
  Mobile: {
    Private: MobilePrivate,
    Public: MobilePublic,
  },
}
