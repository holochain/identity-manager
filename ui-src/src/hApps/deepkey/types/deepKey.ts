export type Hash = String
export type Address = String
export type Signature = String

export type KeyParams = {
  oldKey: Hash,
  signedOldKey: Signature,
  context?: String
}

export type RevParams = {
  revocationKey: Hash,
  signedOldRevocationKey: Signature
}

export type AuthParams = {
  authorizationKeyPath: number,
  signedAuthKey: Signature
}

// agent info to create new agent in conductor
// eg: {id :"test_agent1", name : "Agent 1"}
export interface AgentField {
  id: any,
  name: string
}

export interface AgentSpec {
  id?: string
  name: string
}

export interface AgentList extends AgentSpec {
  hash: string
  fields: Array<AgentField>
}


// tslint:disable no-consecutive-blank-lines
export interface Rule {
  keysetRoot: Hash, // ?? Is this the Root Anchor to which all keys are linked.
  revocationKey: Hash, // NOTE: Created by agent in advance and supplied directly via the Conductor
  priorRevocationSelfSig?: String | null // NOTE: Self-signed via the Signatory hApp, only done upon true Key Revocation
}

export interface Authorizer {
  authorizationKey: Hash,
  revocationAuthority: Hash, // Hash of the Rule entry
  revocationSig: Signature // NOTE: Signed by Rev Key (stored in RUle), ie signed by the Trusted Revocation Auth Party via the Signatory hApp, only done at the actual creation of the Authorization Key
}

export enum KeyType {
  AppUI,
  AppSig,
  AppEnc
}

export interface KeyMeta {
  newKey: Hash,
  derivationIndex: number,
  keyType?: KeyType ,
  context: String, // some_app_DNA_hash
}

export interface Key {
  address: Hash | undefined,
  keyType: KeyType
}

export interface Agent {
  id: String,
  name: String,
  holoRemoteKey?: String
}
