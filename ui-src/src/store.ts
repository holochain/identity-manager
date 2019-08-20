import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { holochainMiddleware } from '@holochain/hc-redux-middleware'
import { connect } from '@holochain/hc-web-client'
import login from './hApps/login/reducer'
import personasProfiles from './hApps/personas-profiles/reducer'
import deepKey from './hApps/deepkey/reducer'


const REACT_APP_CHAT_WEBSOCKET_INTERFACE = process.env.REACT_APP_CHAT_WEBSOCKET_INTERFACE
let rootReducer = combineReducers({ login: login, personasProfiles: personasProfiles, deepKey: deepKey })
let middleware: Array<any>
if (REACT_APP_CHAT_WEBSOCKET_INTERFACE) {
  middleware = [holochainMiddleware(
    connect({ url: REACT_APP_CHAT_WEBSOCKET_INTERFACE }).then(({ onSignal }) => {
      onSignal((signal) => {
        console.log(JSON.stringify(signal.signal))
        if (signal.signal.name === 'open_profile') {
          console.log(JSON.stringify(signal.signal.name))
          const {profileSourceDna} = JSON.parse(signal.signal.arguments)
          console.log(JSON.parse(signal.signal.arguments))
        }
    })
  )]
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
