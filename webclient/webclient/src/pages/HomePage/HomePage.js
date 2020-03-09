import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import './HomePage.sass'


const HomePage = ({ history }) => {
  document.title = 'WalletAppTitle - HomePage'
  return (
    <div className="HomePage" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <br />
      <h1>Home (Public)</h1>
      <br />
      <p>Not implemented yet.</p>
      <br />
      <br />
      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  )
}

export default withRouter(HomePage)
