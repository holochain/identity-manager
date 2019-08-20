import * as React from 'react'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as constants from '../../../constants'
import Profile, { Props } from '../profile'
import { MemoryRouter } from 'react-router-dom'

enzymeConfigure({ adapter: new Adapter() })

export const profileMappedTests = describe('Mapped to Persona info', () => {

  let props: Props
  let mountedProfile: ReactWrapper<Props, {}> | undefined

  const profileForm = () => {
    if (!mountedProfile) {
      mountedProfile = mount(<MemoryRouter initialEntries={['/']}><Profile {...props}/></MemoryRouter>)
    }
    return mountedProfile
  }

  beforeEach(() => {
    mountedProfile = undefined
  })

  const mockFn = jest.fn()
  const mockPromise = jest.fn(() => Promise.reject('Profile test mockPromise'))

  it('When an valid mapping is used, the Profile form has a populated AutoCompleteProfileField for each field in the Profile request', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileMappedCorrectly,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    expect(profileForm().find('AutoCompleteProfileField').length).toEqual(constants.exampleProfile.fields.length)
    profileForm().find('input[name="name"]').map(function (field) {
      expect(field.props().value).not.toEqual(undefined)
      expect(field.props().value).not.toEqual('')
    })
  })
})
