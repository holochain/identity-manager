import * as React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { storiesOf } from '@storybook/react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Personas from '../personas'
import listPersonasNotes from './listPersonas.md'
import * as constants from '../../../constants'
import { specs } from 'storybook-addon-specifications'
import { personaListTests } from './personas.test'
import { Persona } from '../../../types/persona'
import CreateStore from '../../../../../store'

configure({ adapter: new Adapter() })

let store = CreateStore()

storiesOf('Persona', module)
  .add('List Personas', () => {
    specs(() => personaListTests)
    return getPersonas(constants.personas)
  },
  {
    notes: { markdown: listPersonasNotes }
  })


function getPersonas (personas: Array<Persona>) {
  // tslint:disable jsx-no-lambda
  return (<Provider store={store}><MemoryRouter initialEntries={['/']}><Personas personas={personas} getPersonas={jest.fn(() => Promise.resolve('Get Personas'))} /></MemoryRouter></Provider>)
}
