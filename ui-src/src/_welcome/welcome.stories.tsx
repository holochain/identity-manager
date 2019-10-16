import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Navigation from '../nav.jsx'
import welcome from './welcome.md'
import CreateStore from '../store'

let store = CreateStore()

storiesOf('_Sovereign P2P Identity', module)
  .addDecorator(story => (
    <Provider store={store}><MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter></Provider>
  ))
  .add('Identity Manager', () => {
    return <MemoryRouter initialEntries={['/']}><Navigation /></MemoryRouter>
  },
  {
    notes: { markdown: welcome }
  })
