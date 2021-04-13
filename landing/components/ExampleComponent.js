import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useState } from 'react'
import { path, pathOr } from 'ramda'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import { withTranslation } from '../constructors/next-i18next'


export default withTranslation()(({ t }) => {
  return (
    <Paper>
      ExampleComponent is {t('here')}
    </Paper>
  )
})
