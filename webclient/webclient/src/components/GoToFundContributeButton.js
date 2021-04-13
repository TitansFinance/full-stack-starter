import React from 'react'
import { withRouter } from 'react-router'
import { MdAddCircle } from 'react-icons/md'

const GoToFundContributeButton = ({ fund, history }) => <MdAddCircle size={30} onClick={e => {
  e.preventDefault()
  e.stopPropagation()
  history.push(`/funds/${fund.id}/contribute`)
}} />

export default withRouter(GoToFundContributeButton)