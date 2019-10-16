import { vaultReducer, initialState } from './reducer'
import { getType } from 'typesafe-actions'

import * as vaultActions from './actions'
import { Persona } from './types/persona'
import { Profile, UsageType } from './types/profile'

describe('Vault Reducer', () => {

  it('adds retrieved personas to the state in response to GetPersonas.success', () => {
    const testPersonas = [
        { address: '111', entry: { name: 'persona1', hash: '111', fields: [] } },
        { address: '222', entry: { name: 'persona1', hash: '222', fields: [] } }]

    expect(vaultReducer(undefined, vaultActions.GetPersonas.success(testPersonas))).toEqual({
      ...initialState,
      personas: testPersonas.map(elem => elem.entry),
      currentPersona: testPersonas[0].entry
    })
  })

  it('adds retrieved profiles to the state in response to GetProfiles.success', () => {

    const testProfiles: Array<Profile> = [
      { name: 'profile1', fields: [], hash: '', expiry: 0, sourceDna: '' },
      { name: 'profile2', fields: [
        {
          name: 'field1',
          displayName: 'field 1',
          required: true,
          description: '',
          usage: UsageType.STORE,
          schema: {}
        }
      ], hash: '', expiry: 0, sourceDna: '' }
    ]

    expect(vaultReducer(undefined, vaultActions.GetProfiles.success(testProfiles))).toEqual({
      ...initialState,
      profiles: testProfiles
    })
  })

  it('sets the currentPersona on action', () => {

    const persona: Persona = {
      hash: 'HASH',
      fields: [],
      name: 'persona'
    }

    expect(vaultReducer(undefined, {
      type: getType(vaultActions.SetCurrentPersona),
      payload: persona
    })).toEqual({
      ...initialState,
      currentPersona: persona
    })
  })

  it('sets the currentProfile on action', () => {

    const profile: Profile = {
      name: 'profile2',
      fields: [
        {
          name: 'field1',
          displayName: 'field 1',
          required: true,
          description: '',
          usage: UsageType.STORE,
          schema: {}
        }
      ],
      hash: '',
      expiry: 0,
      sourceDna: ''
    }

    expect(vaultReducer(undefined, {
      type: getType(vaultActions.SetCurrentProfile),
      payload: profile
    })).toEqual({
      ...initialState,
      currentProfile: profile
    })
  })

  it('does not mutate the state on unknown action', () => {
    expect(vaultReducer(undefined, {
      type: 'NOTACTION',
      payload: { }
    })).toEqual(initialState)
  })

})
