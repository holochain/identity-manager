import { ActionType, getType } from 'typesafe-actions'
import { combineReducers } from 'redux'
import * as deepKeyAction from './actions'
import { KeyMeta, Authorizer, RevocationRuleSet, KeyType } from './types/deepKey'

export type DeepKeyAction = ActionType<typeof deepKeyAction>

// readonly keyword causes compiler to error if one attempts to mutate the state
export type DeepKeyState = {
  readonly isInitialized: boolean,
  readonly revocationRuleSet?: RevocationRuleSet,
  readonly authorizerKeySet?: Authorizer,
  readonly allKeys: Array<KeyMeta>
}

export type State = DeepKeyState

export const initialState: State = {
  isInitialized: true,
  revocationRuleSet: {
    keysetRoot: 'QmKeySetHash',
    revocationKey: 'HcScIXuxtWI6ttc5gngvQTsDnHtynb5dzyDujh37mNo43nf7ZRB5UZKmR9953pa',
    priorRevocationSelfSig: null
  },
  authorizerKeySet: {
    authorizationKey: 'HcScIXuEYovwaygbPkWEk95xVPd7vemvoB',
    revocationAuthority: 'HcScIXuEYovwaygbPkWEk95xVPd7vemvoB',
    revocationSig: 'QmMockRevocationKeySignatureofAuthKey'
  },
  allKeys: [
    {
      newKey: 'HcScjTnefoi6c79eunbqfFNYEYovwaygbPkWEk95xVPd7vemvoB9Qwbjxf458ii',
      derivationIndex: 3,
      keyType: KeyType.AppSig, // enum vlaue
      context: 'Laptop'
    },
    {
      newKey: 'HcSCj3IY876TgX988Uw65kSdg7PTFtjijjQ97vs9W6qV9gtnaiyWRfEDe3ouprr',
      derivationIndex: 3,
      keyType: KeyType.AppSig, // enum vlaue
      context: 'Mobile Phone'
    }
  ]
}

export function keyReducer (state: DeepKeyState = initialState, action: DeepKeyAction) {
  console.log(deepKeyAction)
  switch (action.type) {
    case getType(deepKeyAction.IsInitialized.success):
      console.log('Is DeepKey initialized ?? : ', action.payload)
      return {
        ...state,
        isInitialized: action.payload
      }

    // case getType(deepKeyAction.GetRevocationRules.success):
    //   console.log('get GetrevocationRuleSet : ', action.payload)
    //   return {
    //     ...state,
    //     revocationRuleSet: action.payload[0].entry
    //   }

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
