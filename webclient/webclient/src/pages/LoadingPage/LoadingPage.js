import React from 'react'
import { MetroSpinner } from 'react-spinners-kit'

import './LoadingPage.sass'

const LoadingPage = props => {
  return (
    <div className="Page LoadingPage">
      <MetroSpinner
        size={16}
        sizeUnit={'vw'}
        color="rgb(41, 41, 41)"
        frontColor="rgb(41, 41, 41)"
        backColor="rgb(230, 207, 107)"
        loading={true}
      />
    </div>
  )
}

export default LoadingPage
