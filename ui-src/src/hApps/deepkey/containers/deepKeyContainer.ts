import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { KeyParams } from '../types/deepKey' // Agent,
import DeepKeyOverview, { StateProps, DispatchProps } from '../components/deepKeyOverview'
import {
	IsInitialized,
  GetRevocationRules,
  // UpdateRevocationRules,
  // SetAuthorizer,
	GetAuthorizer,
	GetAllKeys,
	UpdateKey,
  DeleteKey // ,
  // CreateAgent,
} from '../../deepkey/actions'

// const mapStateToProps = ({ isInitialized, revocationKey, allKeys }: { isInitialized:boolean, revocationKey:string, allKeys:any }): StateProps => ({  isInitialized, revocationKey, allKeys })
const mapStateToProps = (state: any): StateProps => {
  return {
    isInitialized: state.deepkey.deepkey.isInitialized,
    revocationRuleSet: state.deepkey.deepkey.revocationRuleSet,
    authorizerKeySet: state.deepkey.deepkey.authorizerKeySet,
    allKeys: state.deepkey.deepkey.allKeys
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  // DeepKey DNA Calls:
  fetchIsInitialized: () => dispatch(IsInitialized.create({})),
  fetchRevocationRules: () => dispatch(GetRevocationRules.create({})),
  // updateRevocationRules: (args: RevParams) => dispatch(UpdateRevocationRules.create(args)),
  // setAuthorizer: (args: AuthParams) => dispatch(SetAuthorizer.create(args)),
  fetchAuthorizer: () => dispatch(GetAuthorizer.create({})),
  fetchAllKeys: () => dispatch(GetAllKeys.create({})),
  updateKey: (args: KeyParams) => dispatch(UpdateKey.create(args)),
  deleteKey: (args: KeyParams) => dispatch(DeleteKey.create(args))
  // Admin Call:
  // createAgent; args = {id, name}
  // eg: {id :"test_agent1", name : "Agent 1"}
	// createAgent:(args: Agent) => dispatch(CreateAgent(args))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DeepKeyOverview)
