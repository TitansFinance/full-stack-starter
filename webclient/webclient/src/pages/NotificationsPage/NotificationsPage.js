import React, { Component, useState, Suspense } from 'react'
import './NotificationsPage.sass'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import { path } from 'ramda'
import {
//   MdCheckCircle,
//   MdArrowForward,
  MdAccessTime,
} from 'react-icons/md'
import { compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useTranslation } from 'react-i18next'

import moment from '@/constructors/moment'
import Table from '@/components/Table'
import Card from '@/components/Card'
import Loading from '@/components/Loading'


const TableRowMarketingMessage = ({ item }) => {
  const { t, i18n } = useTranslation()
  const {
    type,
    updatedAt,
    data,
  } = item
  return (
    <div className="TableRowMarketingMessage">
      <div className="TableRowNotificationContent">
        <div className="TableRowNotificationData">{path(['message'], data[i18n.language]) || data.message}</div>
      </div>
    </div>
  )
}

const TableRowNotification = ({ item }) => {
  const { t } = useTranslation()
  const {
    type,
    updatedAt,
    data,
  } = item
  let content = t(`NotificationsPage.templates.${type}`, data)
  const lastUpdated = moment(new Date(parseInt(updatedAt, 10))).fromNow()
  return (
    <div className="TableRowNotification">
      <div className="TableRowNotificationIcon">

      </div>
      <div className="TableRowNotificationContent">
        <div className="TableRowNotificationData">{content}</div>
        <div className="TableRowNotificationTime"><MdAccessTime /> {lastUpdated}</div>
      </div>
    </div>
  )
}


const TableNotifications = compose(
  graphql(gql`{
    me {
      id
      notifications {
        type
        data
        createdAt
        updatedAt
      }
    }
  }`),
)(({ data }) => {
  if (data.error) console.error(data.error)
  if (data.loading) return <Loading />
  const { t } = useTranslation()
  const { me: { notifications } } = data
  return (
    <Mutation
      mutation={gql`
        mutation MarkMyNotificationsRead {
          markMyNotificationsRead {
            read
          }
        }
      `}
      refetchQueries={({ data }) => {
        return [{
          query: gql`{
            me {
              id
              notifications {
                read
              }
            }
          }`,
          cachePolicy: 'network-only',
        }]
      }}
      awaitRefetchQueries
    >
      {(markMyNotificationsRead, { data, error, loading }) => {
        return (
          <Card
            title={t('NotificationsPage.Unread\ Notifications')}
            className="TableNotificationsCard"
            buttonAction={markMyNotificationsRead}
            buttonContent={notifications.length ? t('NotificationsPage.Mark\ Read') : null}
          >
            <Table
              className="TableNotifications"
              items={notifications}
              noMoreItemsText={t('No\ more\ notifications')}
            >
              {(props) => {
                switch(props.item.type) {
                  case 'MARKETING':
                    return <TableRowMarketingMessage {...props} />
                  default: return <TableRowNotification {...props} />
                }
              }}
            </Table>
          </Card>
        )
      }}
    </Mutation>
  )
})


const NotificationsPage = props => {
  const { t } = useTranslation()
  return (
    <div className="Page NotificationsPage">
      <TableNotifications />
    </div>
  )
}

export default NotificationsPage
