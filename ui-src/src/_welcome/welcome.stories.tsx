import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { withNotes } from '@storybook/addon-notes'
import Navigation from '../nav.jsx'
import welcome from './welcome.md'
import CreateStore from '../store'

let store = CreateStore()

storiesOf('_Welcome', module)
  .addDecorator(story => (
    <Provider store={store}><MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter></Provider>
  ))
  .add('Home Page', withNotes(welcome)(() => {
    return <MemoryRouter initialEntries={['/']}><Navigation /></MemoryRouter>
  }))
