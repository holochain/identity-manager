import * as React from 'react'
import AutoCompleteProfileField, { State, Props } from '../autoCompleteProfileField'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as constants from '../../../constants'
import { TextField } from '@material-ui/core/'
import Typography from '@material-ui/core/Typography'

enzymeConfigure({ adapter: new Adapter() })

export const autoCompleteProfileFieldNotMappedHasMatchTests = describe('Autocomplete Profile Field not mapped but has matching persona value', () => {
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

  it('Display the Profile Field for an unmapped field with no default that displays your data from your Vault', () => {

    props = {
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      field: constants.exampleProfileNotMappedNoDefaults.fields[1],
      handleMappingChange: mockFn
    }
    expect(autoCompleteProfileField().find(TextField).props().label).toEqual('No Default Value')
    expect(autoCompleteProfileField().find(Typography).text()).toEqual('Default - no_default')
  })
})
