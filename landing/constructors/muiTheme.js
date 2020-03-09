import { createMuiTheme } from '@material-ui/core/styles'
import { red, green, blue } from '@material-ui/core/colors'

/* https://material-ui.com/customization/themes/ */
const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    status: {
      success: green,
      danger: red,
    },
    background: {
      default: '#fff',
    },
  },
})

export default muiTheme
