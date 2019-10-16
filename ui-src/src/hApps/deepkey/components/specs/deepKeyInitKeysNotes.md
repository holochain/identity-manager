** DeepKey Initialized, has a Revocation Rule Set, Authorization Key & Keys **

When the conductor starts DeepKey is bootstrapped and used to create a new Agent Key if needed. When this happens a the RevocationRuleSet is created & the first set of keys is committed to the DHT when the conductor calls dpki_create_agent_key(agent_id).

> Willem & Joel
> Please update the description here with steps on how revocation and auth keys are derived 
