module.exports = scenario => {

  const testPersonaSpec = {
      name: "PersonaName"
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

  const testFieldUpdate = (persona_address) => {
    return {
      persona_address,
      field: {
        name: "test_field",
        data: "updated data"
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

  scenario('Alice_2 can retrieve a list of personas by Alice', async (s, t, {alice, alice_2}) => {
    const result = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    console.log(result)
    t.equal(result.Ok.length, 46)
    const listOfPersonas = await alice_2.callSync("personas", "get_personas", {})
    console.log(listOfPersonas)

    console.log(listOfPersonas.Ok[0])
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
    t.equal(get_result.Ok.filter(p => p.entry.name === "PersonaName")[0].entry.fields.length, 1)
  })

  scenario('Does not re-add an existing field to a persona', async (s, t, {alice}) => {
    const persona_address = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    t.equal(persona_address.Ok.length, 46)
    const add_result = await alice.callSync("personas", "add_field", testField(persona_address.Ok))
    t.notEqual(add_result.Ok, undefined)
    const add_result_2 = await alice.callSync("personas", "add_field", testField(persona_address.Ok))
    t.notEqual(add_result_2.Ok, undefined)
    const get_result = await alice.callSync("personas", "get_personas", {})
    t.equal(get_result.Ok.filter(p => p.entry.name === "PersonaName")[0].entry.fields.length, 1)
  })

  scenario('Can update a persona name', async (s, t, {alice}) => {
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

  scenario('Does not attempt to update a persona spec that has not changed', async (s, t, {alice}) => {
    const result = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    console.log(result)
    const resultUpdate = await alice.callSync("personas", "update_persona", {persona_address: result.Ok, spec: testPersonaSpec})
    console.log(resultUpdate)
    t.equal(resultUpdate.Ok.length, 46)
    const listOfPersonas = await alice.callSync("personas", "get_personas", {})
    console.log(listOfPersonas)
    t.equal(listOfPersonas.Ok.length, 1)
    t.equal(listOfPersonas.Ok[0].entry.name, testPersonaSpec.name)
  })

  scenario.only('Updates the data in an existing field of a persona', async (s, t, {alice}) => {
    const persona_address = await alice.callSync("personas", "create_persona", {spec: testPersonaSpec})
    t.equal(persona_address.Ok.length, 46)
    const add_result = await alice.callSync("personas", "add_field", testField(persona_address.Ok))
    t.notEqual(add_result.Ok, undefined)
    const add_result_2 = await alice.callSync("personas", "add_field", testFieldUpdate(persona_address.Ok))
    t.notEqual(add_result_2.Ok, undefined)
    const get_result = await alice.callSync("personas", "get_personas", {})
    t.equal(get_result.Ok.filter(p => p.entry.name === "PersonaName")[0].entry.fields.length, 1)
    t.equal(get_result.Ok.filter(p => p.entry.name === "PersonaName")[0].entry.fields[0].data, "updated data")

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
