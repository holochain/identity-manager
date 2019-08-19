import { connect } from 'react-redux'
import LoginForm, { StateProps, DispatchProps } from '../components/login'
import { Dispatch } from 'redux'
import {
  Login
} from '../actions'

const mapStateToProps = (): StateProps => {
  return {
    title: `Login`
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    login: (loginSpec) => dispatch(Login.create({ spec: loginSpec }))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)
