const should = require('should');
const addContext = require('mochawesome/addContext');

it('should have context', function () {
  (1+1).should.equal(2);
  addContext(this, {
        title: 'How I Feel When Tests Fail',
        value: 'http://i.imgur.com/c4jt321.png'
      });
});

describe('How to work with Personas', function () {
  it('Add a new Personal persona by clicking the Add button', function () {
    cy.visit('/persona/new')
    cy.title().should('eq', 'Holochain Identity Manager')
    cy.get('input[name="personaName"]').type('Personal', { delay: 25 })
    cy.log('Fill out the name you want to refer to this Persona as')
    cy.get('button[name="addField"]').click()
    cy.log('Click the Add Field button to start adding your information')
    cy.get('input[name="fieldName0"]').type('full_name', { delay: 25 })
    cy.log('Fill out the field name such as "full_name"')
    cy.get('input[name="fieldValue0"]').type('Phil Beadle', { delay: 25 })
    cy.log('and a value such as "Phil"')
    cy.get('button[name="addField"]').click()
    cy.get('input[name="fieldName1"]').type('address', { delay: 25 })
    cy.get('input[name="fieldValue1"]').type('123 Holochain Road', { delay: 25 })
    cy.get('button[name="addField"]').click()
    cy.get('input[name="fieldName2"]').type('suburb', { delay: 25 })
    cy.get('input[name="fieldValue2"]').type('Burwood', { delay: 25 })
    cy.get('button[name="addField"]').click()
    cy.get('input[name="fieldName3"]').type('city', { delay: 25 })
    cy.get('input[name="fieldValue3"]').type('Melbourne', { delay: 25 })
    cy.get('button[name="submitPersona"]').click()
    cy.log('Click the Create Persona button to save into your private data.')
    cy.wait(500)
  })
  it('Add a new Work persona by clicking the Add button', function () {
    cy.visit('/persona/new')
    cy.title().should('eq', 'Holochain Identity Manager')
    cy.get('input[name="personaName"]').type('Work', { delay: 25 })
    cy.log('Fill out the name you want to refer to this Persona as')
    cy.get('button[name="addField"]').click()
    cy.log('Click the Add Field button to start adding your information')
    cy.get('input[name="fieldName0"]').type('full_name', { delay: 25 })
    cy.log('Fill out the field name such as "full_name"')
    cy.get('input[name="fieldValue0"]').type('Philip James Beadle', { delay: 25 })
    cy.log('and a value such as "Phil"')
    cy.get('button[name="addField"]').click()
    cy.get('input[name="fieldName1"]').type('role', { delay: 25 })
    cy.get('input[name="fieldValue1"]').type('Engineer', { delay: 25 })
    cy.get('button[name="addField"]').click()
    cy.get('input[name="fieldName2"]').type('location', { delay: 25 })
    cy.get('input[name="fieldValue2"]').type('Melbourne', { delay: 25 })
    cy.get('button[name="submitPersona"]').click()
    cy.log('Click the Create Persona button to save into your private data.')
    cy.wait(500)
  })
  it('Add a new Friends persona by clicking the Add button', function () {
    cy.visit('/persona/new')
    cy.title().should('eq', 'Holochain Identity Manager')
    cy.get('input[name="personaName"]').type('Friends', { delay: 25 })
    addContext(this, 'Fill out the name you want to refer to this Persona as')
    cy.get('button[name="addField"]').click()
    cy.log('Click the Add Field button to start adding your information')
    cy.get('input[name="fieldName0"]').type('handle', { delay: 25 })
    cy.log('Fill out the field name such as "handle"')
    cy.get('input[name="fieldValue0"]').type('@philt3r', { delay: 25 })
    cy.get('button[name="addField"]').click()
    cy.log('Click the Add Field button to start adding your information')
    cy.get('input[name="fieldName1"]').type('avatar', { delay: 25 })
    cy.get('input[name="fieldValue1"]').type('https://avatars0.githubusercontent.com/u/5264862?s=60&v=4', { delay: 25 })
    cy.get('button[name="addField"]').click()
    cy.get('input[name="fieldName2"]').type('hobby', { delay: 25 })
    cy.get('input[name="fieldValue2"]').type('DJ', { delay: 25 })
    cy.get('button[name="submitPersona"]').click()
    cy.log('Click the Create Persona button to save into your private data.')
    cy.wait(500)
  })
})
