import { createBrowserHistory, createHashHistory } from 'history'

// export default createBrowserHistory()
export default (typeof window !== 'undefined' && window.Cordova) ? createHashHistory() : createBrowserHistory()
