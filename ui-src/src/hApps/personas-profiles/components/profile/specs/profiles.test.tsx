import * as React from 'react'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as constants from '../../../constants'
import Profiles, { Props } from '../profiles'
import { MemoryRouter } from 'react-router-dom'

enzymeConfigure({ adapter: new Adapter() })

export const profilesTests = describe('', () => {

  let props: Props
  let mountedProfile: ReactWrapper<Props, {}> | undefined

  const profileField = () => {
    if (!mountedProfile) {
      mountedProfile = mount(<MemoryRouter initialEntries={['/']}><Profiles {...props}/></MemoryRouter>)
    }
    return mountedProfile
  }

  beforeEach(() => {
    mountedProfile = undefined
  })

  // const mockFn = jest.fn()
  const mockPromise = jest.fn(() => Promise.reject(''))

  it('The list of Profiles shows.', () => {
    props = {
      profiles: [constants.exampleProfileMappedCorrectly, constants.exampleProfileNotMappedNoDefaultsManualMap, constants.exampleProfileNotMappedNoDefaults],
      getProfiles: mockPromise
    }
    expect(profileField().find('Route').length).toEqual(3)
  })
  it('Clicking a Profile links you to the profile details page', () => {
    props = {
      profiles: [constants.exampleProfileMappedCorrectly, constants.exampleProfileNotMappedNoDefaultsManualMap, constants.exampleProfileNotMappedNoDefaults],
      getProfiles: mockPromise
    }
    profileField().find('Route').first().simulate('click')
  })
})
