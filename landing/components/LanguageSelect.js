import cx from 'classnames'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { withTranslation } from '../constructors/next-i18next'

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

export default withTranslation()(({ t, i18n }) => {
  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
    localStorage.setItem('lng', lng)
  }

  const { loading, error, data } = useQuery(gql`{ supportedLanguages { key name } }`);

  if (loading) return '';
  if (error) return `Error! ${error.message}`;

  const { supportedLanguages } = data

  return (
    <FormControl>
      <Select
        value={i18n.language || 'en'}
        onChange={(e) => changeLanguage(e.target.value)}
        inputProps={{
          name: 'language',
          id: 'language-simple',
        }}
      >
        {supportedLanguages.map((lang, i) => <MenuItem key={i} value={lang.key}>{lang.name}</MenuItem>)}
      </Select>
    </FormControl>
  )
})
