const path = require('path')
const tape = require('tape')
const { Orchestrator, combine, callSync, singleConductor, tapeExecutor } = require('@holochain/try-o-rama')
const orchestrator = new Orchestrator({
  globalConfig: {logger: false, network: {
      type: 'sim2h',
      sim2h_url: 'wss://0.0.0.0:9001'
    }
  },
  middleware: combine(callSync, singleConductor, tapeExecutor(tape))
})
process.on('unhandledRejection', error => {
  console.error('got unhandledRejection:', error);
});

require('./agent/personas')(orchestrator.registerScenario)
// require('./agent/profiles')(orchestrator.registerScenario)

orchestrator.run()
