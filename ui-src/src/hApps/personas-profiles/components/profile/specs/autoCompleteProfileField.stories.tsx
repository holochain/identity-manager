import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { specs } from 'storybook-addon-specifications'
import AutoCompleteProfileField from '../autoCompleteProfileField'
import profileNotMappedNoDefaults from './profileNotMappedNoDefaults.md'
import profileNotMappedHasDefaults from './profileNotMappedHasDefaults.md'
import profileMapped from './profileMapped.md'
import { autoCompleteProfileFieldNotMappedNoMatchTests } from './autoCompleteProfileFieldNotMappedNoMatch.test'
import { autoCompleteProfileFieldNotMappedHasMatchTests } from './autoCompleteProfileFieldNotMappedHasMatch.test'
import { autoCompleteProfileFieldMappedTests } from './autoCompleteProfileFieldMapped.test'

import * as constants from '../../../constants'

storiesOf('Profile/AutoComplete', module)
  .add('Autocomplete Profile Field mapped to Persona data', () => {
    specs(() => autoCompleteProfileFieldMappedTests)
    const props = {
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfile,
      field: constants.exampleProfile.fields[0],
      handleMappingChange: action('Select a Persona Field')
    }
    return <AutoCompleteProfileField {...props} />
  },
  {
    notes: { markdown: profileMapped }
  })
  .add('Autocomplete Profile Field not mapped no matching persona field', () => {
    specs(() => autoCompleteProfileFieldNotMappedNoMatchTests)
    const props = {
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      field: constants.exampleProfileNotMappedNoDefaults.fields[1],
      handleMappingChange: action('Select a Persona Field')
    }
    return <AutoCompleteProfileField {...props} />
  },
  {
    notes: { markdown: profileNotMappedNoDefaults }
  })
  .add('Autocomplete Profile Field not mapped but has matching persona value', () => {
    specs(() => autoCompleteProfileFieldNotMappedHasMatchTests)
    const props = {
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMapped,
      field: constants.exampleProfileNotMapped.fields[0],
      handleMappingChange: action('Select a Persona Field')
    }
    return <AutoCompleteProfileField {...props} />
  },
  {
    notes: { markdown: profileNotMappedHasDefaults }
  })
