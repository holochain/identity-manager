import { ActionType, getType } from 'typesafe-actions'
import { combineReducers } from 'redux'
import * as loginActions from './actions'

export type LoginAction = ActionType<typeof loginActions>
// readonly keyword causes compiler to error if one attempts to mutate the state
export type LoginState = {
  readonly loggedIn: boolean,
}
export type State = LoginState
export const initialState: State = {
  loggedIn: false
}

export function loginReducer (state: LoginState = initialState, action: LoginAction) {
  switch (action.type) {
    case getType(loginActions.Login.success):
      console.log(action)
      let isLoggedIn = action.payload
      return {
        ...state,
        loggedIn: isLoggedIn
      }
    default:
      return state
  }
}

export default combineReducers({
  login: loginReducer
})
