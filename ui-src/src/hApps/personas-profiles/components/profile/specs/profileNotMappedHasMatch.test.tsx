import * as React from 'react'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as constants from '../../../constants'
import Profile, { Props } from '../profile'
import { MemoryRouter } from 'react-router-dom'

enzymeConfigure({ adapter: new Adapter() })

export const profileNotMappedHasMatchTests = describe('Not mapped has matching defaults', () => {

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

  it('A new Profile has an filled AutoCompleteProfileField for each field in the Profile request that matches a Persona field', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMapped,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    expect(profileForm().find('AutoCompleteProfileField').length).toEqual(constants.exampleProfile.fields.length)
    let fields = profileForm().find('input[name="name"]')
    expect(fields.first().props().value).toEqual('@philt3r')
    expect(fields.at(1).props().value).toEqual('Phil')
    expect(fields.last().props().value).toEqual('Beadle') // not mapped sop gets default
  })
})
