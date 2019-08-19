import * as React from 'react'
import { mount, configure as enzymeConfigure, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CreateStore from '../../../store'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import LoginForm, { Props, State } from './login'
import { Login as LoginType } from '../types/login'

enzymeConfigure({ adapter: new Adapter() })

let store = CreateStore()

export const loginTests = describe('Holo', () => {

  let props: Props
  let mountedLogin: ReactWrapper<Props, State> | undefined
  const loginView = () => {
    if (!mountedLogin) {
      mountedLogin = mount(<Provider store={store}><MemoryRouter initialEntries={['/']}><LoginForm {...props}/></MemoryRouter></Provider>)
    }
    return mountedLogin
  }

  const mockFn = jest.fn()

  beforeEach(() => {
    mountedLogin = undefined
  })


  it('Entering your login details and clicking \'Log In\' sends your details to Holo', () => {

    props = {
      title: 'Login',
      login: mockFn
    }

    const testLogin: LoginType = {
      email: 'philip.beadle@holo.host',
      password: 'aPa55word'
    }

    loginView().find('input[name="email"]').simulate('change', { target: { value: 'philip.beadle@holo.host' } })
    loginView().find('input[name="password"]').simulate('change', { target: { value: 'aPa55word' } })
    loginView().find('button[name="submit"]').simulate('click')
    let createdLogin: LoginType = (loginView().find('LoginForm').instance().state as State).login
    expect(createdLogin).toEqual(testLogin)
    expect(props.login).toBeCalled()
  })
})
