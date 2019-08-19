import * as React from 'react'
import Persona, { PersonaBase, State, Props } from './persona'
import { Persona as PersonaType } from '../../types/persona'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CreateStore from '../../../../store'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

let store = CreateStore()
enzymeConfigure({ adapter: new Adapter() })

export const editPersonaTests = describe('Edit Existing Persona', () => {

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

  const mockFn = jest.fn()
  const mockPromise = jest.fn(() => Promise.reject(''))

  it('Edit a Persona by changing the name and adding new fields and values, this will send an updated Persona to Holochain', () => {
    let editPersona: PersonaType = {
      hash: 'hash11111',
      name: 'Personal',
      fields: [
          { name: 'firstName', data: 'Phil' },
          { name: 'lastName', data: 'Beadle' }
      ]
    }

    props = {
      currentPersona: editPersona,
      title: 'Edit - Persona',
      personas: [],
      create: mockPromise,
      update: mockPromise,
      delete: mockFn,
      getPersonas: mockPromise
    }

    const testPersona: PersonaType = {
      hash: 'hash11111',
      name: 'Edited Persona Name',
      fields: [
          { name: 'editfirstName', data: 'Philip' },
          { name: 'editlastName', data: 'Holo' },
          { name: 'extra', data: 'row' }
      ]
    }

    personaView().find('input[name="personaName"]').simulate('change', { target: { value: 'Edited Persona Name' } })
    personaView().find('input[name="fieldName0"]').simulate('change', { target: { value: 'editfirstName' } })
    personaView().find('input[name="fieldValue0"]').simulate('change', { target: { value: 'Philip' } })
    personaView().find('input[name="fieldName1"]').simulate('change', { target: { value: 'editlastName' } })
    personaView().find('input[name="fieldValue1"]').simulate('change', { target: { value: 'Holo' } })
    personaView().find('button[name="addField"]').simulate('click')
    personaView().find('input[name="fieldName2"]').simulate('change', { target: { value: 'extra' } })
    personaView().find('input[name="fieldValue2"]').simulate('change', { target: { value: 'row' } })
    personaView().find('button[name="submitPersona"]').simulate('click')
    let editedPersona: PersonaType = (personaView().find('Persona').instance().state as State).persona
    expect(editedPersona).toEqual(testPersona)
    expect(props.update).toBeCalled()
  })

  it('Delete a Persona by clicking Delete, this will open a confirm dialog and then send a delete Persona to Holochain', (done) => {
    let editPersona: PersonaType = {
      hash: 'hash11111',
      name: 'Personal',
      fields: [
          { name: 'firstName', data: 'Phil' },
          { name: 'lastName', data: 'Beadle' }
      ]
    }

    props = {
      currentPersona: editPersona,
      title: 'Edit - Persona',
      personas: [],
      create: mockFn,
      update: mockFn,
      delete: mockPromise,
      getPersonas: mockPromise
    }

    personaView().find('button[name="deletePersona"]').simulate('click')
    process.nextTick(() => {
      personaView().find('button[id="Agree"]').simulate('click')
      expect(props.delete).toBeCalled()
      done()
    })
  })

  it('Check the state persona is set when props set persona', () => {
    let editPersona: PersonaType = {
      hash: 'hash11111',
      name: 'Personal',
      fields: [
          { name: 'firstName', data: 'Phil' },
          { name: 'lastName', data: 'Beadle' }
      ]
    }
    props = {
      currentPersona: editPersona,
      title: 'Edit - Persona',
      personas: [],
      create: mockFn,
      update: mockFn,
      delete: mockFn,
      getPersonas: mockPromise
    }
    const prevState = {
    }
    // @ts-ignore
    let newState = PersonaBase.getDerivedStateFromProps(props, prevState)
    expect(newState!.persona).toEqual(editPersona)
  })

  it('Check getDerivedStateFromProps returns null when props dont set persona', () => {
    let editPersona: PersonaType = {
      hash: 'hash11111',
      name: 'Personal',
      fields: [
          { name: 'firstName', data: 'Phil' },
          { name: 'lastName', data: 'Beadle' }
      ]
    }
    props = {
      currentPersona: editPersona,
      title: 'Edit - Persona',
      personas: [],
      create: mockFn,
      update: mockFn,
      delete: mockFn,
      getPersonas: mockPromise
    }
    const prevState = {
      persona: {}
    }
    // @ts-ignore
    let newState = PersonaBase.getDerivedStateFromProps(props, prevState)
    expect(newState).toEqual(null)
  })
})
