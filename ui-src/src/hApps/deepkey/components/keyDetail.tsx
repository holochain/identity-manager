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
import DeleteForever from '@material-ui/icons/DeleteForever'
import cyan from '@material-ui/core/colors/cyan'
import { KeyMeta } from '../types/deepKey'

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
  tealAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: cyan[200],
  },
})

export interface OwnProps {
  classes?: any,
  deepKey: KeyMeta
}

export interface DispatchProps {
  updateKey: (key: KeyMeta) => Promise<string>,
  deleteKey: (key: KeyMeta) => Promise<string>
}

export type Props = OwnProps & DispatchProps

class KeyDetail extends React.Component<Props, {}> {

  updateKey = (key: KeyMeta) => {
    console.log(key)
      this.props.updateKey(key)
        .catch(err => console.error(err))
  }

  deleteKey = (key: KeyMeta) => {
    console.log(key)
    //   this.props.deleteKey()
    //     .then(this.props.getPersonas)
    //     .catch(err => console.error(err))
  }

  render () {
    const { classes, deepKey } = this.props

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
    			<CardHeader
            avatar={
              <Avatar aria-label='key' className={classes.tealAvatar}>
                <VpnKey color='action'/>
              </Avatar>
            }
            title='Key'
            titleTypographyProps={{ variant: 'h6' }}
            subheader={`${deepKey.newKey}`}
            subheaderTypographyProps={{ variant: 'body2' }}
    			/>
    			<hr style={{ margin: '5px auto', width: '95%' }}/>
    			<CardActions className={classes.actions}>
    				<Button size='small' color='primary' onClick={() => this.updateKey(deepKey)}>
    					<Autorenew/>
    					Replace
    				</Button>
            <Button size='small' color='primary' onClick={() => this.deleteKey(deepKey)}>
    					<DeleteForever/>
    					Delete
    				</Button>
    			</CardActions>
    		</Card>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(KeyDetail))
