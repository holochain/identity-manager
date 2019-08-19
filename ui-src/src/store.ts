import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { holochainMiddleware } from '@holochain/hc-redux-middleware'
import { connect } from '@holochain/hc-web-client'
import login from './hApps/login/reducer'

const REACT_APP_CHAT_WEBSOCKET_INTERFACE = process.env.REACT_APP_CHAT_WEBSOCKET_INTERFACE
let rootReducer = combineReducers({ login: login })
let middleware: Array<any>
if (REACT_APP_CHAT_WEBSOCKET_INTERFACE) {
  middleware = [holochainMiddleware(connect({ url: REACT_APP_CHAT_WEBSOCKET_INTERFACE }))]
} else {
  middleware = [holochainMiddleware(connect())]
}
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function CreateStore () {
  return createStore(
  	rootReducer,
  	composeEnhancers(
      applyMiddleware(...middleware)
    )
  )
}

export default CreateStore
