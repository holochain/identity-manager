import { createHolochainZomeCallAsyncAction } from '@holochain/hc-redux-middleware'
import { Login as LoginType } from './types/login'

export const Login = createHolochainZomeCallAsyncAction<{spec: LoginType}, string>('personas-profiles', 'login', 'login')
