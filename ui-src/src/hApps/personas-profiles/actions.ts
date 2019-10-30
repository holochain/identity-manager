import { createHolochainZomeCallAsyncAction } from '@holochain/hc-redux-middleware'
import { createAction } from 'typesafe-actions'

import { Persona, PersonaSpec, PersonaField } from './types/persona'
import { ProfileMapping, Profile } from './types/profile'

/*----------  Persona Actions  ----------*/

export const CreatePersona = createHolochainZomeCallAsyncAction<{spec: PersonaSpec}, string>('personas-profiles', 'personas', 'create_persona')

export const UpdatePersona = createHolochainZomeCallAsyncAction<{persona_address: string, spec: PersonaSpec}, string>('personas-profiles', 'personas', 'update_persona')

export const DeletePersona = createHolochainZomeCallAsyncAction<{persona_address: string}, null>('personas-profiles', 'personas', 'delete_persona')

export const GetPersonas = createHolochainZomeCallAsyncAction<{}, Array<{address: string, entry: Persona}>>('personas-profiles', 'personas', 'get_personas')

export const AddField = createHolochainZomeCallAsyncAction<{persona_address: string, field: PersonaField}, null>('personas-profiles', 'personas', 'add_field')

/*----------  Profile Actions  ----------*/

export const GetProfiles = createHolochainZomeCallAsyncAction<{}, Array<Profile>>('personas-profiles', 'profiles', 'get_profiles')

export const CreateMapping = createHolochainZomeCallAsyncAction<{mapping: ProfileMapping}, {mappings_created: number}>('personas-profiles', 'profiles', 'create_mapping')

export const Saved = createHolochainZomeCallAsyncAction<{ui: String, location: String}, null>('personas-profiles', 'profiles', 'saved')

/*----------  non holochain actions  ----------*/

export const SetCurrentPersona = createAction('holo-vault/SET_CURRENT_PERSONA', resolve => {
  return (persona: Persona) => resolve(persona)
})

export const SetCurrentProfile = createAction('holo-vault/SET_CURRENT_PROFILE', resolve => {
  return (profile: Profile) => resolve(profile)
})
