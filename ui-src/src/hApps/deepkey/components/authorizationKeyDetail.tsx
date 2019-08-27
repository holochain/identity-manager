import * as React from 'react'
import { createStyles, withStyles } from '@material-ui/core/styles';
import withRoot from '../../../withRoot'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Autorenew from '@material-ui/icons/Autorenew'
import Avatar from '@material-ui/core/Avatar'
import VpnKey from '@material-ui/icons/VpnKey'
import deepPurple from '@material-ui/core/colors/deepPurple'
import { Authorizer, AuthParams } from '../types/deepKey'

const styles = () => createStyles({
  card: {
    minWidth: 300
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  actions: {
    display: 'flex'
  },
  title: {
    fontSize: 8,
    marginTop: 10
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
})

export interface OwnProps {
  classes?: any,
  authorizerKeySet: Authorizer
}

export interface DispatchProps {
  setAuthorizer: (auth: AuthParams) => Promise<string>
}

export type Props = OwnProps & DispatchProps

class AuthorizationKeyDetail extends React.Component<Props, {}> {

  handleSetAuthorizer = (auth: AuthParams) => {
    console.log(auth)
    //   this.props.setAuthorizer(this.state.persona.hash, personaSpec, personaFields)
    //     .then(this.props.getPersonas)
    //     .catch(err => console.error(err))
  }

  render () {
    const { classes, authorizerKeySet } = this.props

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
    			<CardHeader
            avatar={
              <Avatar aria-label='key' className={classes.purpleAvatar}>
                <VpnKey color='error'/>
              </Avatar>
            }
            title='Authorization Key'
            titleTypographyProps={{ variant: 'h6' }}
            subheader={`${authorizerKeySet.authorizationKey}`}
            subheaderTypographyProps={{ variant: 'body2' }}
    			/>
    			<hr style={{ margin: '5px auto', width: '95%' }}/>
    			<CardActions className={classes.actions}>
    				<Button size='small' color='primary' onClick={() => this.handleSetAuthorizer({authorizationKeyPath: 3, signedAuthKey:authorizerKeySet.revocationSig})}>
    					<Autorenew/>
    					Replace
    				</Button>
    			</CardActions>
    		</Card>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(AuthorizationKeyDetail))
