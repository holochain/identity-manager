import * as React from 'react'
import { Provider } from 'react-redux'
import Navigation from './nav'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const Root = ({ store }: {store: any}) => (
  <Provider store={store}>
    <Router>
      <Route path='/' component={Navigation} />
    </Router>
  </Provider>
)

export default Root
