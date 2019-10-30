import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { holochainMiddleware } from '@holochain/hc-redux-middleware'
import { connect } from '@holochain/hc-web-client'
import login from './hApps/login/reducer'
import personasProfiles from './hApps/personas-profiles/reducer'
import deepkey from './hApps/deepkey/reducer'


const REACT_APP_WEBSOCKET_INTERFACE = process.env.REACT_APP_WEBSOCKET_INTERFACE // 'ws://localhost:10000' //process.env.REACT_APP_WEBSOCKET_INTERFACE

let rootReducer = combineReducers({ login: login, personasProfiles: personasProfiles, deepkey: deepkey })
let middleware: Array<any>
if (REACT_APP_WEBSOCKET_INTERFACE) {
  middleware = [
    holochainMiddleware(connect({ url: REACT_APP_WEBSOCKET_INTERFACE }))  ]
} else {
  middleware = [holochainMiddleware(connect())]
  //   holochainMiddleware(connect().then((webclient) => {
  //     webclient.onSignal((signal) => {
  //       console.log(JSON.stringify(signal.signal))
  //       if (signal.signal.name === 'open_profile') {
  //         console.log(JSON.stringify(signal.signal.name))
  //         const { profileSourceDna } = JSON.parse(signal.signal.arguments)
  //         console.log('Open Profile for ' + profileSourceDna)
  //       }
  //     })
  //     return webclient
  //   })
  // )]
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
