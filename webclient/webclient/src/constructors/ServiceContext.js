import React from 'react'
import apollo from '@/constructors/apollo'
import gql from 'graphql-tag'


const ServiceContext = React.createContext({
  rates: null,
  userCurrency: null,
  convertToUserCurrency: () => {

  },
})


export default ServiceContext
