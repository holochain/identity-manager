import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Profile as ProfileType, ProfileField } from '../types/profile'
import { Persona as PersonaType, PersonaField } from '../types/persona'
import Profile, { Props, RouterProps, StateProps, DispatchProps } from '../components/profile/profile'

import {
  CreateMapping,
  GetProfiles,
  GetPersonas,
  AddField,
  SetCurrentPersona
} from '../actions'

const mapStateToProps = (state: any, ownProps: Props & RouterProps): StateProps => {

  // use the route to filter profiles to get the selected profile
  // will return undefined if non-existent

  let profile: ProfileType
  let returnUrl: string = '/profiles'
  // get the current profile from the url if possible
  if (ownProps.match) {
    const hash = ownProps.match.params.hash
    profile = state.personasProfiles.profile.profiles.filter((profile: ProfileType) => {
      console.log(profile.sourceDna === hash)
      return profile.sourceDna === hash
    })[0]
    if (ownProps.match.params.returnUrl) {
      returnUrl = ownProps.match.params.returnUrl
    } else {
      returnUrl = '/profiles'
    }
    console.log('returnUrl ' + returnUrl)
  } else { // otherwise use the current profile from the state
    profile = state.personasProfiles.profile.currentProfile
  }

  return {
    returnUrl: returnUrl,
    personas: state.personasProfiles.profile.personas,
    selectedPersona: state.personasProfiles.profile.currentPersona,
    profile: profile
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    getProfiles: () => dispatch(GetProfiles.create({})),
    getPersonas: () => dispatch(GetPersonas.create({})),
    setCurrentPersona: (newCurrentPersona: PersonaType) => { dispatch(SetCurrentPersona(newCurrentPersona)) },
    save: (profile: ProfileType, newPersonaFields: Array<PersonaField>) => {
      // call createMapping on all of the fields with a mapping
      console.log('About to map ', profile)

      return Promise.all(
        profile.fields.filter(field => field.mapping).map((field: ProfileField) => {

          let actions = []

          console.log('check if the profile field {0} exists on the persona ', field.displayName)
          if (field.mapping !== undefined) {
            let personaAddress = field.mapping.personaAddress
            let personaFieldName = field.mapping.personaFieldName
            let personaFields = newPersonaFields.filter(function (field) {
              return field.name === personaFieldName
            })
            console.log(personaFields)
            if (personaFields.length === 1) {
              console.log('add field to persona ', field)

              let personaField: PersonaField = personaFields[0]
              actions.push(dispatch(AddField.create({ persona_address: personaAddress, field: personaField })))
            }
          }
          console.log('creating map for ', field)
          actions.push(dispatch(CreateMapping.create({mapping: {
            ...field.mapping!,
            retrieverDna: profile.sourceDna,
            profileFieldName: field.name
          }})))

          return Promise.all(actions)
        })
      )

    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
