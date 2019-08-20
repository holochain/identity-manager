const path = require('path')
const tape = require('tape')

const { Diorama, tapeExecutor, backwardCompatibilityMiddleware } = require('@holochain/diorama')

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('got unhandledRejection:', error);
});

const dnaPath = path.join(__dirname, "../dist/dna-src.dna.json")
const dna = Diorama.dna(dnaPath, 'personas')

const diorama = new Diorama({
  instances: {
    alice: dna,
  },
  bridges: [
  ],
  debugLog: false,
  executor: tapeExecutor(require('tape')),
  middleware: backwardCompatibilityMiddleware,
})

require('./agent/personas')(diorama.registerScenario)
require('./agent/profiles')(diorama.registerScenario)

diorama.run()
