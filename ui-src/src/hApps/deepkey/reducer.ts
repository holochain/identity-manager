import { ActionType, getType } from 'typesafe-actions'
import { combineReducers } from 'redux'
import * as deepKeyAction from './actions'

export type DeepKeyAction = ActionType<typeof deepKeyAction>

// readonly keyword causes compiler to error if one attempts to mutate the state
export type DeepKeyState = {
  readonly isInitialized: false,
  readonly revocationRuleSet: undefined,
  readonly authorizerKeySet: undefined,
  readonly allKeys: []
}

export type State = DeepKeyState

export const initialState: State = {
  isInitialized: false,
  revocationRuleSet: undefined,
  authorizerKeySet: undefined,
  allKeys: []
}

export function keyReducer (state: DeepKeyState = initialState, action: DeepKeyAction) {
  switch (action.type) {
    case getType(deepKeyAction.IsInitialized.success):
      console.log('Is DeepKey initialized ?? : ', action.payload)
      return {
        ...state,
        isInitialized: action.payload
      }

    case getType(deepKeyAction.GetRevocationRules.success):
      console.log('get GetrevocationRuleSet : ', action.payload)
      return {
        ...state,
        revocationRuleSet: action.payload[0].entry
      }

    case getType(deepKeyAction.GetAuthorizer.success):
      console.log('get Authorizer : ', action.payload)
      return {
        ...state,
        AuthorizerKeySet: action.payload[0].entry
      }

    case getType(deepKeyAction.GetAllKeys.success):
      console.log('get all keys : ', action.payload)
      return {
        ...state,
        allKeys: action.payload
      }

    default:
      return state
  }
}

export default combineReducers({
  deepkey: keyReducer
})
