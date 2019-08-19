import * as React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import { DeleteForever, Autorenew } from '@material-ui/icons'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../../withRoot'

const styles = ({ palette }: Theme) => createStyles({
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
  }
})

function DeepKeyDetail (props: any) {
  const { currentKey, classes, keyType, address, updateKey } = props

  // const currentKeyProps = revocationRuleSetProp || authorizerKeySetProp || agentKeyProps
  const displayProp = (text: string) => {
    const transformedText = text.replace(/([A-Z])/g, ' $1').trim()
    const capFirstLetter = transformedText[0].toUpperCase()
    const newString = capFirstLetter + transformedText.substr(1)
    return newString
  }

  const makeZomeCall = (action: string, params?: any) => {
    const actionCall = props[action]
    actionCall(params)
      .catch((reason: any) => { console.log('HC ZOMECALL ERROR = action, result : ', action, JSON.stringify(reason)) })
  }

  const updateCurrentKey = () => {
    if (keyType === 'revocationKey') {
      makeZomeCall('updateRevocationRules', { revocationKey: address, signedOldRevocationKey: currentKey.priorRevocationSelfSig })
    } else if (keyType === 'authorizationKey') {
      makeZomeCall('setAuthorizer', { authorizationKeyPath: 1, signedAuthKey: 'how_do_we_determine_this????' })  // TODO: Review how to DETERMINE THIS....,
    } else {
      updateKey({
        oldKey: address,
        signedOldKey: 'IS_THIS_THE_REV_KEY_Signature_????',
        context: currentKey.context
      })
      makeZomeCall('updateKey', { oldKey: address, signedOldKey: 'IS_THIS_THE_REV_KEY_Signature_????', context: currentKey.context })
    }
  }

  const deleteCurrentKey = () => {
    if (keyType === 'revocationKey') {
      console.log('Trying to delete a revocation key. This is not possible. Please update/replace key instead.')
    } else if (keyType === 'authorizationKey') {
      console.log('Trying to delete a authorization key. This is not possible. Please update/replace key instead.')
    } else {
      makeZomeCall('deleteKey', { oldKey: address, signedOldKey: 'IS_THIS_THE_REV_KEY_Signature_????' })
    }
  }

  return (
		<Card className={classes.card}>
			<CardHeader
        title={`${displayProp(keyType)}`}
        titleTypographyProps={{ variant: 'h6' }}
        subheader={`${address}`}
        subheaderTypographyProps={{ variant: 'body2' }}
			/>
			<hr style={{ margin: '5px auto', width: '95%' }}/>
			<CardActions className={classes.actions}>
				<Button size='small' color='primary' onClick={(updateCurrentKey)}>
					<Autorenew/>
					Replace
				</Button>
				<Button size='small' color='primary' onClick={deleteCurrentKey}>
					<DeleteForever/>
					Delete
				</Button>
			</CardActions>
		</Card>
  )
}

export default withRoot(withStyles(styles)(DeepKeyDetail))
