import * as React from 'react'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../../withRoot'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { KeyMeta, KeyParams, RevParams, AuthParams, Authorizer, RevocationRuleSet } from '../types/deepKey'
import RevocationKeyDetail from './revocationKeyDetail'
import AuthorizationKeyDetail from './authorizationKeyDetail'
import KeyDetail from './keyDetail'
import {
  IsInitialized,
  GetRevocationRules,
  GetAuthorizer,
  GetAllKeys,
  UpdateKey,
  DeleteKey,
  UpdateRevocationRules,
  SetAuthorizer } from '../../deepkey/actions'

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    textAlign: 'left',
    paddingTop: spacing(1)
  },
  paper: {
    padding: spacing(1)
  },
  card: {
    margn: spacing(1)
  }
})

export interface OwnProps {
  classes?: any,
  address?: string,
  keyType?: string
}

export interface StateProps {
  isInitialized: boolean,
  revocationRuleSet?: RevocationRuleSet,
  authorizerKeySet?: Authorizer,
  allKeys: Array<KeyMeta>
}

export interface DispatchProps {
  fetchIsInitialized: typeof IsInitialized.sig,
  fetchRevocationRules: typeof GetRevocationRules.sig,
  fetchAuthorizer: typeof GetAuthorizer.sig,
  fetchAllKeys: typeof GetAllKeys.sig,
  updateKey: (args: KeyParams) => typeof UpdateKey.create,
  deleteKey: (args: KeyParams) => typeof DeleteKey.create,
  updateRevocationRules: (args: RevParams) => typeof UpdateRevocationRules.create,
  setAuthorizer: (args: AuthParams) => typeof SetAuthorizer.create
}

export type Props = OwnProps & StateProps & DispatchProps

class DeepKeyOverview extends React.Component<Props, {}> {
  componentDidMount () {
    this.props.fetchRevocationRules({})
      .catch((reason: any) => {
        console.log('fetchRevocationRules ERROR: ', JSON.stringify(reason))
      })
    this.props.fetchAuthorizer({})
      .catch((reason: any) => {
        console.log('fetchAuthorizer ERROR: ', JSON.stringify(reason))
      })
    this.props.fetchIsInitialized({})
      .catch((reason: any) => {
        console.log('fetchIsInitialized ERROR: ', JSON.stringify(reason))
      })
    this.props.fetchAllKeys({})
      .catch((reason: any) => {
        console.log('fetchAllKeys ERROR: ', JSON.stringify(reason))
      })
  }

  render () {
    const { classes, revocationRuleSet, updateRevocationRules, authorizerKeySet, setAuthorizer, isInitialized, allKeys } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant='h4'>
            DeepKey
          </Typography>
          <Typography variant='body1' gutterBottom={true}>
            All DeepKey Information is stored here, so you can keep track of your device seeds/keys and know exactly which devices are secured.
          </Typography>
          {isInitialized && revocationRuleSet && authorizerKeySet && allKeys ?
            <div>
              <Typography variant='h5' gutterBottom={true}>
                Available Keys
              </Typography>
              <RevocationKeyDetail className={classes.paper} key={0} revocationRuleSet={revocationRuleSet} updateRevocationRules={updateRevocationRules} />
              <AuthorizationKeyDetail className={classes.paper} key={1} authorizerKeySet={authorizerKeySet} setAuthorizer={setAuthorizer} />
              {
                allKeys.map((key: KeyMeta, index: number) => (
                  <KeyDetail
                    className={classes.paper}
                    key={index+2}
                    deepKey={key}
                    keyType={key.keyType}
                    index={index}
                    currentKey={key}
                    updateKey={this.props.updateKey}
                    deleteKey={this.props.deleteKey}
                  />
                ))
              }
            </div>
            : isInitialized && revocationRuleSet && !allKeys ?
              <div>
                <Typography variant='subtitle1' gutterBottom={true}>
                  No Keys Currently Available
                </Typography>
              </div>
              : isInitialized && revocationRuleSet  && authorizerKeySet ?
                <div>
                  <Typography variant='subtitle1' gutterBottom={true}>
                    Revocation Key
                  </Typography>
                  <RevocationKeyDetail revocationRuleSet={revocationRuleSet} updateRevocationRules={updateRevocationRules} />
                  <AuthorizationKeyDetail authorizerKeySet={authorizerKeySet} setAuthorizer={setAuthorizer} />
                </div>
              : isInitialized && revocationRuleSet ?
              <div>
                <Typography variant='subtitle1' gutterBottom={true}>
                  Revocation Key
                </Typography>
                <RevocationKeyDetail revocationRuleSet={revocationRuleSet} updateRevocationRules={updateRevocationRules} />
              </div>
            : isInitialized ?
              <Typography variant='subtitle1' gutterBottom={true}>
                DeepKey is Initialized
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
