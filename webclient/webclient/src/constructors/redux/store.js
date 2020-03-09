import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '@/constructors/redux/reducers/index.js'

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


export default function createReduxStore() {
  const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk))
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('@/constructors/redux/reducers', () => {
      const nextRootReducer = require('@/constructors/redux/reducers/index.js')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
