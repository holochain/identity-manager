module.exports = scenario => {

  const testPersonaSpec = {
      name: "something"
  }

  const testUpdatePersonaSpec = {
      name: "Updated"
  }

  const testField = (persona_address) => {
    return {
      persona_address,
      field: {
        name: "test_field",
        data: "string data"
      }
    }
  }

  scenario('Can create a persona', async (s, t, {alice}) => {
    const result = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    console.log(result)
    t.equal(result.Ok.length, 46)
  })

  scenario('A Default persona is created', async (s, t, {alice}) => {
    const listOfPersonas = await alice.callSync("personas", "get_personas", {})
    console.log(listOfPersonas)
    t.equal(listOfPersonas.Ok.length, 1)
    t.equal(listOfPersonas.Ok.filter(p => p.entry.name === "Default")[0].entry.fields.length, 0)
  })

  scenario('Can retrieve a list of personas', async (s, t, {alice}) => {
    const result = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    console.log(result)
    t.equal(result.Ok.length, 46)
    const listOfPersonas = await alice.callSync("personas", "get_personas", {})
    console.log(listOfPersonas)
    t.equal(listOfPersonas.Ok.length, 1)
  })


  scenario('Can add a field to a persona', async (s, t, {alice}) => {
    const persona_address = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    console.log(persona_address.Ok)
    t.equal(persona_address.Ok.length, 46)
    const add_result = await alice.callSync("personas", "add_field", testField(persona_address.Ok))
    console.log(add_result)
    t.notEqual(add_result.Ok, undefined)

    // can get the field
    const get_result = await alice.callSync("personas", "get_personas", {})
    console.log(get_result)
    t.equal(get_result.Ok.filter(p => p.entry.name === "something")[0].entry.fields.length, 1)
  })

  scenario('Can update a persona', async (s, t, {alice}) => {
    const result = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    console.log(result)
    const resultUpdate = await alice.callSync("personas", "update_persona", {persona_address: result.Ok, spec: testUpdatePersonaSpec})
    console.log(resultUpdate)
    t.equal(resultUpdate.Ok.length, 46)
    const listOfPersonas = await alice.callSync("personas", "get_personas", {})
    console.log(listOfPersonas)
    t.equal(listOfPersonas.Ok.length, 1)
    t.equal(listOfPersonas.Ok[0].entry.name, testUpdatePersonaSpec.name)
  })

  scenario('Can delete a persona', async (s, t, {alice}) => {
    const listOfPersonas = await alice.callSync("personas", "get_personas", {})
    console.log(listOfPersonas)
    t.equal(listOfPersonas.Ok.length, 1)
    const result = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    console.log(result)
    const resultDelete = await alice.callSync("personas", "delete_persona", {persona_address: result.Ok})
    console.log(resultDelete)
    t.equal(resultDelete.Ok.length, 46)
    const listOfPersonas_2 = await alice.callSync("personas", "get_personas", {})
    console.log(listOfPersonas_2)
    t.equal(listOfPersonas_2.Ok.length, 1)
    t.equal(listOfPersonas_2.Ok.filter(p => p.entry.name === "Default")[0].entry.fields.length, 0)
  })
}
