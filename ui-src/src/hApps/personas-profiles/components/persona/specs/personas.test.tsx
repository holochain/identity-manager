import * as React from 'react'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as constants from '../../../constants'
import Personas, { Props } from '../personas'
import { MemoryRouter } from 'react-router-dom'

enzymeConfigure({ adapter: new Adapter() })

export const personaListTests = describe('List Personas', () => {

  let props: Props
  let mountedPdersonas: ReactWrapper<Props, {}> | undefined

  const personasList = () => {
    if (!mountedPdersonas) {
      mountedPdersonas = mount(<MemoryRouter initialEntries={['/']}><Personas {...props}/></MemoryRouter>)
    }
    return mountedPdersonas
  }

  beforeEach(() => {
    mountedPdersonas = undefined
  })

  // const mockFn = jest.fn()
  const mockPromise = jest.fn(() => Promise.reject(''))

  it('The list of Personas shows.', () => {
    props = {
      personas: constants.personas,
      getPersonas: mockPromise
    }
    expect(personasList().find('Route').length).toEqual(5)
  })

  it('Clicking a Persona links you to the persona details page', () => {
    props = {
      personas: constants.personas,
      getPersonas: mockPromise
    }
    personasList().find('Route').first().simulate('click')
  })
})
