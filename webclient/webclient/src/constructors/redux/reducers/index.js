import { combineReducers } from 'redux'
import layout from './layout'
import modal from './modal'

const rootReducer = combineReducers({
  layout,
  modal,
})

export default rootReducer
