module.exports = scenario => {

  const testFieldSpec = {
    name: "test_field",
    displayName: "Test Field",
    required: true,
    description: "",
    usage: "STORE",
    schema: ""
  }

  const testProfileSpec = {
    name: "something",
    sourceDna: "xxx",
    fields: [testFieldSpec]
  }

  // scenario('Can register a profile spec', async (s, t,  {alice}) => {
  //   const register_result = await alice.callSync("profiles", "register_app", {spec: testProfileSpec})
  //   console.log(register_result)
  //   t.notEqual(register_result.Ok, undefined)
  // })
  //
  // scenario('Can get a list of profiles', async (s, t, {alice}) => {
  //   const register_result = await alice.callSync("profiles", "register_app", {spec: testProfileSpec})
  //   t.notEqual(register_result.Ok, undefined)
  //   const get_result = await alice.callSync("profiles", "get_profiles", {})
  //   console.log(get_result)
  //   t.deepEqual(get_result.Ok.length, 1)
  // })

  scenario('Register a profile spec and save a mapped profile', async (s, t,  {alice}) => {
    const register_result = await alice.callSync("profiles", "register_app", {spec: testProfileSpec})
    t.notEqual(register_result.Ok, undefined)
    console.log(register_result)
    // can callSync the function with garbage data
    const map_result1 = await alice.callSync("profiles", "create_mapping",
      {
        mapping: {
          retrieverDna: "xxx",
          profileFieldName: "xxx",
          personaAddress: "xxx",
          personaFieldName: "dd"
        }
      })
    console.log(map_result1)
    // should not map any fields
    t.deepEqual(map_result1.Ok, { mappingsCreated: 0 }, "should not create a mapping as there are no matching fields");

    // create a persona to map to and add a field
    const result = await alice.callSync("personas", "create_persona", {spec: {name: "mapToPersona"}})
    console.log(result)
    const persona_address = result.Ok
    const add_result = await alice.callSync("personas", "add_field", {persona_address: persona_address, field: {name: "test_field", data: "string data"}})
    console.log(add_result)

    const field_result = await alice.callSync("personas", "get_field", {persona_address: persona_address, field_name: "test_field"})
    console.log(field_result)

    // can callSync the function to create a mapping
    const map_result2 = await alice.callSync("profiles", "create_mapping",
      {
        mapping: {
          retrieverDna: "xxx",
          profileFieldName: "test_field",
          personaAddress: persona_address,
          personaFieldName: "test_field"
        }
      })
    console.log(map_result2)
    // should map a single field
    t.deepEqual(map_result2.Ok, { mappingsCreated: 1 }, "a single mapping should be created");

    // can then see the field is mapped
    const get_result = await alice.callSync("profiles", "get_profiles", {})
    console.log(get_result.Ok[0])
    t.deepEqual(get_result.Ok.filter(p => p.name === "something")[0].fields[0].mapping, {personaAddress: persona_address, personaFieldName: 'test_field'})
  })

  scenario.only('Update a profile field mapping', async (s, t,  {alice}) => {
    const register_result = await alice.callSync("profiles", "register_app", {spec: testProfileSpec})
    // create a persona to map to and add a field
    const result = await alice.callSync("personas", "create_persona", {spec: {name: "mapToPersona"}})
    console.log(result)
    const persona_address = result.Ok
    const add_result = await alice.callSync("personas", "add_field", {persona_address: persona_address, field: {name: "test_field", data: "string data"}})
    const add_result_2 = await alice.callSync("personas", "add_field", {persona_address: persona_address, field: {name: "test_field_2", data: "field 2 data"}})
    const map_result = await alice.callSync("profiles", "create_mapping",
      {
        mapping: {
          retrieverDna: "xxx",
          profileFieldName: "test_field",
          personaAddress: persona_address,
          personaFieldName: "test_field"
        }
      })
    t.deepEqual(map_result.Ok, { mappingsCreated: 1 }, "a single mapping should be created");
    const get_result = await alice.callSync("profiles", "get_profiles", {})
    t.deepEqual(get_result.Ok.filter(p => p.name === "something")[0].fields[0].mapping, {personaAddress: persona_address, personaFieldName: 'test_field'})
    //Now update the mapping
    const map_result_2 = await alice.callSync("profiles", "create_mapping",
      {
        mapping: {
          retrieverDna: "xxx",
          profileFieldName: "test_field",
          personaAddress: persona_address,
          personaFieldName: "test_field_2"
        }
      })
    t.deepEqual(map_result_2.Ok, { mappingsCreated: 1 }, "a single mapping should be created");
    const get_result_2 = await alice.callSync("profiles", "get_profiles", {})
    t.deepEqual(get_result_2.Ok.filter(p => p.name === "something")[0].fields[0].mapping, {personaAddress: persona_address, personaFieldName: 'test_field_2'})
    //Check it only updates a mapping if iut has changed
    const map_result_3 = await alice.callSync("profiles", "create_mapping",
      {
        mapping: {
          retrieverDna: "xxx",
          profileFieldName: "test_field",
          personaAddress: persona_address,
          personaFieldName: "test_field_2"
        }
      })
  })
}
