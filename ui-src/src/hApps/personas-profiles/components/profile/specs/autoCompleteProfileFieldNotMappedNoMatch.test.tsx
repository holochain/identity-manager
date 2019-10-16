import * as React from 'react'
import AutoCompleteProfileField, { State, Props } from '../autoCompleteProfileField'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as constants from '../../../constants'
// import { Suggestion as SuggestionType } from '../../../types/suggestion'
import { TextField } from '@material-ui/core/'
import Typography from '@material-ui/core/Typography'
// import MenuItem from '@material-ui/core/MenuItem'

enzymeConfigure({ adapter: new Adapter() })

export const autoCompleteProfileFieldNotMappedNoMatchTests = describe('Autocomplete Profile Field not mapped no matching persona field', () => {

  let props: Props
  let mountedAutoCompleteProfileField: ReactWrapper<Props, State> | undefined

  const autoCompleteProfileField = () => {
    if (!mountedAutoCompleteProfileField) {
      mountedAutoCompleteProfileField = mount(<AutoCompleteProfileField {...props}/>)
    }
    return mountedAutoCompleteProfileField
  }

  beforeEach(() => {
    mountedAutoCompleteProfileField = undefined
  })

  const mockFn = jest.fn()

  it('Display the Profile Field for an unmapped field with no default that stores your data in the hApp DHT', () => {

    props = {
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      field: constants.exampleProfileNotMappedNoDefaults.fields[0],
      handleMappingChange: mockFn
    }
    expect(autoCompleteProfileField().find(TextField).props().label).toEqual('Genre')
    expect(autoCompleteProfileField().find(Typography).text()).toEqual('Default - genre')
  })
})
