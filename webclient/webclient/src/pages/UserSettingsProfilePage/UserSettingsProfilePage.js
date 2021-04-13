import React, { useState, useRef } from 'react'
import * as log from 'loglevel'
import { Link, withRouter } from 'react-router-dom'
import { compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useTranslation } from 'react-i18next'
import { MdEdit, MdSave, MdClose } from 'react-icons/md'
import { equals } from 'ramda'

import apollo from '@/constructors/apollo'
import { withRequestEmailVerificationCode } from '@/constructors/apollo/wrappers'
import LoadingPage from '@/pages/LoadingPage'
import UpdatePasswordForm from '@/components/UpdatePasswordForm'
import Input from '@/components/Input'
import EditInput from '@/components/EditInput'
import Button from '@/components/Button'
import Row from '@/components/Row'
import SettingsRow from '@/components/SettingsRow'
import CurrentUserImage from '@/components/CurrentUserImage'
import { getErrorKey } from '@/utils'

import './UserSettingsProfilePage.sass'


const UserSettings = compose(
  graphql(gql`{
    me {
      id
      firstName
      lastName
      email
      username
    }
  }`),
)(({ history, data }) => {
  if (data.error) console.error(data.error)
  if (data.loading) return <LoadingPage />
  const { t } = useTranslation()

  const { me } = data

  const userSettings = useRef(null)
  const [username, setUsername] = useState(me.username)
  const [usernameEditMode, setUsernameEditMode] = useState(false)
  const [firstName, setFirstName] = useState(me.firstName || '')
  const [firstNameEditMode, setFirstNameEditMode] = useState(false)
  const [lastName, setLastName] = useState(me.lastName || '')
  const [lastNameEditMode, setLastNameEditMode] = useState(false)

  const changesHaveBeenMade = Boolean(
    username !== me.username
    || firstName !== me.firstName
    || lastName !== me.lastName
  )

  const cancel = () => {
    setUsername(me.username)
    setUsernameEditMode(false)
    setFirstName(me.firstName)
    setFirstNameEditMode(false)
    setLastName(me.lastName)
    setLastNameEditMode(false)
  }

  return (
    <Mutation
      mutation={gql`
        mutation UpdateMe($input: UserInput) {
          updateMe(input: $input) {
            firstName
            lastName
            username
          }
        }
      `}
      refetchQueries={({ data }) => {
        return [{
          query: gql`{
            me {
              id
              firstName
              lastName
              username
            }
          }`,
        }]
      }}
    >
      {(updateMe, { data, error, loading }) => {
        return (
          <div className="UserSettings" ref={userSettings}>
            <Row className="UserSettingsProfileImageAndHandle">
              <CurrentUserImage editable size={100} />
              <div style={{ marginTop: '1em' }}>{me.email}</div>
            </Row>
            <Row>
              <EditInput
                label={t('Username')}
                className="UserSettingsEditInputUsername"
                placeholder={t('Username')}
                editing={usernameEditMode}
                allowInputs={Input.allow.username}
                onChange={e => setUsername(e.target.value)}
                value={username}
                focusRoot={userSettings.current}
                onEdit={() => setUsernameEditMode(true)}
                onBlur={() => setUsernameEditMode(false)}
              />
            </Row>
            <Row>
              <EditInput
                label={t('First\ Name')}
                className="UserSettingsEditInputFirstName"
                placeholder={t('First\ Name')}
                editing={firstNameEditMode}
                allowInputs={Input.allow.firstLastNames}
                onChange={e => setFirstName(e.target.value)}
                value={firstName}
                focusRoot={userSettings.current}
                onEdit={() => setFirstNameEditMode(true)}
                onBlur={() => setFirstNameEditMode(false)}
              />
            </Row>
            <Row>
              <EditInput
                label={t('Last\ Name')}
                className="UserSettingsEditInputLastName"
                placeholder={t('Last\ Name')}
                editing={lastNameEditMode}
                allowInputs={Input.allow.firstLastNames}
                onChange={e => setLastName(e.target.value)}
                value={lastName}
                focusRoot={userSettings.current}
                onEdit={() => setLastNameEditMode(true)}
                onBlur={() => setLastNameEditMode(false)}
              />
            </Row>
            <Row>
              <Button
                disabled={!changesHaveBeenMade}
                onClick={async () => {
                  if (!changesHaveBeenMade) return
                  await updateMe({
                    variables: {
                      input: {
                        username,
                        firstName,
                        lastName,
                      },
                    },
                  })
                }}
                className="DoneButton"
                children={t('Save')}
              />
            </Row>
            <Row className="flex-center">
              {changesHaveBeenMade ? (
                <span className="background-text" onClick={() => cancel()}>{t('Cancel')}</span>
              ) : null}
            </Row>
          </div>
        )
      }}
    </Mutation>
  )
})



const UserSettingsProfilePage = ({}) => {
  document.title = 'WalletAppTitle - Settings'
  return (
    <div className="Page PageSettings UserSettingsProfilePage">
      <UserSettings />
      <UpdatePasswordForm />
    </div>
  )
}

export default UserSettingsProfilePage
