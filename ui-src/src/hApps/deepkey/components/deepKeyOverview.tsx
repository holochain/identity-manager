import * as React from 'react'
import { Route } from 'react-router-dom'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../../withRoot'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { IsInitialized, GetRevocationRules, GetAuthorizer, GetAllKeys } from '../../deepkey/actions'
import { Key, KeyParams, Authorizer, Rule } from '../types/deepKey'
import DeepKeyDetail from './deepKeyDetail'

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
  address?: string,
  keyType?: string
}

export interface StateProps {
  isInitialized: boolean,
  revocationRuleSet: Rule,
  authorizerKeySet: Authorizer,
  allKeys: Array<Key>
}

export interface DispatchProps {
  fetchIsInitialized: typeof IsInitialized.sig,
  fetchRevocationRules: typeof GetRevocationRules.sig,
  fetchAuthorizer: typeof GetAuthorizer.sig,
  fetchAllKeys: typeof GetAllKeys.sig,
  updateKey: (key: KeyParams) => Promise<string>,
  deleteKey: (key: KeyParams) => Promise<string>
}

export type Props = OwnProps & StateProps & DispatchProps

class DeepKeyOverview extends React.Component<Props, {}> {
  // makeZomeCall = (action: string) => {
  //   const actionCall = this.props[action]
  //   // console.log('actionCall : ', actionCall)
  //   actionCall()
  //     .catch((reason: any) => { console.log('HC ZOMECALL ERROR: ', JSON.stringify(reason)) })
  // }

  // componentDidMount () {
  //   this.makeZomeCall('fetchRevocationRules')
  //   this.makeZomeCall('fetchAuthorizer')
  //   this.makeZomeCall('fetchIsInitialized')
  //   this.makeZomeCall('fetchAllKeys')
  //
  //   console.log('this.props', this.props)
  // }

  render () {
    const { classes, revocationRuleSet, isInitialized, allKeys } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant='h4'>
            DeepKey
          </Typography>
          <Typography variant='body1' gutterBottom={true}>
            All DeepKey Information is stored here, so you can keep track of your device seeds/keys and know exactly which devices are secured.
          </Typography>

          <hr/>
          {isInitialized ?
            <Typography variant='subtitle1' gutterBottom={true}>
              DeepKey is Initialized
            </Typography>

          : isInitialized && revocationRuleSet ?
            <div>
              <Typography variant='subtitle1' gutterBottom={true}>
                Available Keys
              </Typography>

              <DeepKeyDetail address={revocationRuleSet.revocationKey} keyType={'revocationKey'}/>
            </div>

            : isInitialized && revocationRuleSet && allKeys ?
              <List>
                {
                  allKeys.map((key: Key, index: number) => (
                    // tslint:disable-next-line jsx-no-lambda
                    <Route
                      key={`${index}-deepkey`}
                      render={({ history }) => (
                        <ListItem key={index} button={true} onClick={() => { history.push(`/deepkey/${key.keyType}`) }}>
                          <ListItemText primary={key.keyType} />
                          <DeepKeyDetail address={key.address} keyType={key.keyType}/>
                        </ListItem>
                      )}
                    />
                  ))
                }
              </List>

            : isInitialized && revocationRuleSet && !allKeys ?
            <Typography variant='subtitle1' gutterBottom={true}>
              No Keys Currently Available
            </Typography>

            :
            <main>
              <Typography variant='subtitle1' gutterBottom={true}>
                Warning: Your DeepKey is Not Initialized.
              </Typography>
              <Typography variant='subtitle2' gutterBottom={true}>
                Please ensure your conductor is correctly configured with DeepKey and running.
              </Typography>
            </main>
          }
        </Paper>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(DeepKeyOverview))
