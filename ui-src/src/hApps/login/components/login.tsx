import * as React from 'react'
import withRoot from '../../../withRoot'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Login as LoginType } from '../types/login'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography';

export interface OwnProps {
  classes?: any
}
export interface RouterProps extends RouteComponentProps<{}> {}
export interface StateProps {
  title: string
}
export interface DispatchProps {
  login: (login: LoginType) => void
}

export type Props = OwnProps & StateProps & DispatchProps

export interface State {
  login: LoginType
}

const styles = ({ palette }: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: palette.background.default,
    color: palette.primary.main,
  }
})

class LoginForm extends React.Component<Props & RouterProps, State> {

  constructor (props: Props & RouterProps) {
    super(props)
    this.state = {
      login: {
        email: '',
        password: ''
      }
    }
  }

  handleSubmit = () => {
    this.props.login(this.state.login)
    this.props.history.push('/')
  }

  updateEmail (email: string) {
    this.setState({
      login: {
        ...this.state.login,
        email: email
      }
    })
  }

  updatePassword (password: string) {
    this.setState({
      login: {
        ...this.state.login,
        password: password
      }
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardMedia
            component="img"
            alt="Holo Logo"
            height="240"
            image="holo-dots.png"
            title="Holo Logo"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Generate Your Holo Keys
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
            Welcome to the Agent Centric Web where you are in control of your personal data.
            Use the same email password combination to access all of your Holo Apps and keep your
            personal data safe and private.
            </Typography>
            <div>
              <TextField name='email' value={this.state.login.email} onChange={e => this.updateEmail(e.target.value)} label='Email'/>
              <TextField name='password' value={this.state.login.password} onChange={e => this.updatePassword(e.target.value)} label='Password'/>
            </div>
          </CardContent>
          <CardActions>
            <Button name='submit' onClick={() => this.handleSubmit()} color='primary'>
              Log In
            </Button>
          </CardActions>
        </Card>
      </div>
    )
  }
}
export default withRoot(withStyles(styles)(withRouter(LoginForm)))
