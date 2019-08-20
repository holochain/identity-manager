import * as React from 'react'
import Persona, { State, Props } from '../persona'
import { Persona as PersonaType } from '../../../types/persona'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CreateStore from '../../../../../store'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

let store = CreateStore()
enzymeConfigure({ adapter: new Adapter() })

export const newPersonaTests = describe('New Persona', () => {

  let props: Props
  let mountedPersona: ReactWrapper<Props, State> | undefined

  const personaView = () => {
    if (!mountedPersona) {
      mountedPersona = mount(<Provider store={store}><MemoryRouter initialEntries={['/']}><Persona {...props}/></MemoryRouter></Provider>)
    }
    return mountedPersona
  }

  beforeEach(() => {
    mountedPersona = undefined
  })

  const mockPromise = jest.fn(() => Promise.reject(''))

  it('Create a Persona by adding new fields and values, this will send a Persona to Holochain', () => {
    let newPersona: PersonaType = {
      name: '',
      hash: '',
      fields: [
      ]
    }

    props = {
      currentPersona: newPersona,
      title: 'New - Persona',
      personas: [],
      create: mockPromise,
      update: mockPromise,
      delete: mockPromise,
      getPersonas: mockPromise
    }

    const testPersona = {
      hash: '',
      name: 'Personal',
      fields: [
          { name: 'firstName', data: 'Phil' },
          { name: 'lastName', data: 'Beadle' }
      ]
    }

    personaView().find('input[name="personaName"]').simulate('change', { target: { value: 'Personal' } })
    personaView().find('button[name="addField"]').simulate('click')
    personaView().find('input[name="fieldName0"]').simulate('change', { target: { value: 'firstName' } })
    personaView().find('input[name="fieldValue0"]').simulate('change', { target: { value: 'Phil' } })
    personaView().find('button[name="addField"]').simulate('click')
    personaView().find('input[name="fieldName1"]').simulate('change', { target: { value: 'lastName' } })
    personaView().find('input[name="fieldValue1"]').simulate('change', { target: { value: 'Beadle' } })
    personaView().find('button[name="submitPersona"]').simulate('click')
    let createdPersona: PersonaType = (personaView().find('Persona').instance().state as State).persona
    expect(createdPersona).toEqual(testPersona)
    expect(props.create).toBeCalled()
  })
})
