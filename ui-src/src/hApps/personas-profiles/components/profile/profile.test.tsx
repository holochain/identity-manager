import * as React from 'react'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as constants from '../../constants'
import Profile, { ProfileBase, Props, State } from './profile'
import { Profile as ProfileType } from '../../types/profile'
import { MemoryRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'

enzymeConfigure({ adapter: new Adapter() })

export const profileTests = describe('', () => {

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

  it('A new Profile has an empty AutoCompleteProfileField for each field in the Profile request', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    expect(profileForm().find('AutoCompleteProfileField').length).toEqual(constants.exampleProfileNotMappedNoDefaults.fields.length)
    profileForm().find('input[name="name"]').map(function (field) {
      expect(field.props().value).toEqual('')
    })
  })

  it('When an invalid mapping is used, the Profile has an empty AutoCompleteProfileField for each field in the Profile request', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleFaultyProfile,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    expect(profileForm().find('AutoCompleteProfileField').length).toEqual(constants.exampleProfile.fields.length)
    let fields = profileForm().find('input[name="name"]')
    expect(fields.first().props().value).toEqual('')
    expect(fields.at(1).props().value).toEqual('')
    expect(fields.last().props().value).toEqual('Beadle') // not mapped sop gets default
  })

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

  it('Mapping or entering new info into a field updates the Profile state', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    let profile: ProfileType = (profileForm().find('Profile').instance().state as State).profile
    expect(profile.fields[0].mapping).toEqual(undefined)
    profileForm().find('input[name="name"]').first().simulate('change', { target: { value: '@' } })
    profileForm().find('input[name="name"]').first().simulate('focus')
    profileForm().find(MenuItem).first().simulate('click')
    profileForm().find('input[name="name"]').first().simulate('blur')
    profile = (profileForm().find('Profile').instance().state as State).profile
    expect(profile.fields[0].mapping).not.toEqual(undefined)
  })

  it('Clicking Save Profile fires the event', () => {
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

    profileForm().find(Button).simulate('click')
    expect(props.save).toBeCalled()
  })

  it('Entering a value into an unmapped field adds the field to the selected Persona', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    profileForm().find('input[name="name"]').first().simulate('change', { target: { value: 'Techno' } })
    profileForm().find('input[name="name"]').first().simulate('focus')
    profileForm().find('input[name="name"]').first().simulate('blur')
  })

  it('Check getDerivedStateFromProps returns null when props dont set a profile', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    const prevState = {
      profile: {}
    }
    // @ts-ignore
    let newState = ProfileBase.getDerivedStateFromProps(props, prevState)
    expect(newState).toEqual(null)
  })
  it('Check getDerivedStateFromProps returns correct state update when props set a profile', () => {
    props = {
      returnUrl: '',
      personas: constants.personas,
      selectedPersona: constants.personas[0],
      profile: constants.exampleProfileNotMappedNoDefaults,
      save: mockPromise,
      getProfiles: mockPromise,
      getPersonas: mockPromise,
      setCurrentPersona: mockFn
    }
    const prevState = {
      profile: {}
    }
    // @ts-ignore
    let newState = ProfileBase.getDerivedStateFromProps(props, prevState)
    expect(newState).toEqual(null)
  })
})
