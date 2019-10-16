import * as React from 'react'
import { Route } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import withRoot from '../../../../withRoot'
import Typography from '@material-ui/core/Typography'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { GetProfiles } from '../../actions'
import Paper from '@material-ui/core/Paper'

// import Avatar from '@material-ui/core/Avatar'
// import Markdown from 'react-markdown'

import { Profile } from '../../types/profile'

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    textAlign: 'left',
    paddingTop: spacing(1)
  },
  paper: {
    padding: spacing(1)
  }
})

export interface OwnProps {
  classes?: any,
}

export interface StateProps {
  profiles: Array<Profile>
}

export interface DispatchProps {
  getProfiles: typeof GetProfiles.sig
}

export type Props = OwnProps & StateProps & DispatchProps

class Profiles extends React.Component<Props, {}> {

  componentDidMount () {

    this.props.getProfiles({})
    .catch(reason => { console.log(JSON.stringify(reason)) })
  }

  render () {
    const { classes, profiles } = this.props
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant='h4'>
            Profiles
          </Typography>
          <Typography variant='body1' gutterBottom={true}>
            Each time an app asks for Profile Information it gets stored here so you can see exactly what your information is being used for.
          </Typography>
          <List>
            {
              profiles.map((profile: Profile, index: number) => (
                // tslint:disable-next-line jsx-no-lambda
                <Route
                  key={index}
                  render={({ history }) => (
                    <ListItem button={true} onClick={() => { history.push(`/profile/${profile.sourceDna}`) }}>
                      <ListItemText primary={profile.name} />
                    </ListItem>
                  )}
                />
              ))
            }
          </List>
        </Paper>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(Profiles))
