extern crate utils;
use hdk::{
    AGENT_ADDRESS,
    holochain_core_types::{
        entry::Entry,
        link::LinkMatch,
    },
    holochain_json_api::{
        json::RawString,
    },
    holochain_persistence_api::{
        cas::content::Address,
    },
    error::{
        ZomeApiResult,
        ZomeApiError,
    }
};

// use std::convert::TryFrom;

use utils::{
    GetLinksLoadResult,
    get_links_and_load_type
};

use crate::{
    persona::{
        PersonaSpec,
        Persona,
        PersonaField,
    },
    PERSONA_ENTRY,
    PERSONA_FIELD_ENTRY,
    PERSONA_ANCHOR_ENTRY,
    PERSONA_FIELDS_LINK_TYPE,
    PERSONA_ANCHOR_LINK_TYPE,
};

/*==========================================
=            public fn handlers            =
==========================================*/

pub fn handle_create_persona(spec: PersonaSpec) -> ZomeApiResult<Address> {

    let persona_entry = Entry::App(PERSONA_ENTRY.into(), spec.into());
    let anchor_entry = Entry::App(PERSONA_ANCHOR_ENTRY.into(), Address::from(AGENT_ADDRESS.to_string()).into());
    let persona_address = hdk::commit_entry(&persona_entry)?;
    let anchor_address = hdk::commit_entry(&anchor_entry)?;
    hdk::link_entries(&anchor_address, &persona_address, PERSONA_ANCHOR_LINK_TYPE, "")?;

    Ok(persona_address.to_string().into())
}

pub fn handle_update_persona(persona_address: Address, spec: PersonaSpec) -> ZomeApiResult<Address> {
    hdk::update_entry(Entry::App(PERSONA_ENTRY.into(), spec.into()), &persona_address)
}

pub fn handle_delete_persona(persona_address: Address) -> ZomeApiResult<Address> {
    let anchor_entry = Entry::App(PERSONA_ANCHOR_ENTRY.into(), Address::from(AGENT_ADDRESS.to_string()).into());
    let anchor_address = hdk::commit_entry(&anchor_entry)?;
    hdk::remove_link(&anchor_address.clone(), &persona_address.clone(), PERSONA_ANCHOR_LINK_TYPE, "")?;
    hdk::remove_entry(&persona_address)
}

pub fn handle_get_personas() -> ZomeApiResult<Vec<GetLinksLoadResult<Persona>>> {
    let anchor_address = hdk::commit_entry(
        &Entry::App(
            PERSONA_ANCHOR_ENTRY.into(),
            Address::from(AGENT_ADDRESS.to_string()).into(),
        )
    )?;

    let persona_specs: Vec<GetLinksLoadResult<PersonaSpec>> = get_links_and_load_type(&anchor_address, LinkMatch::Exactly(PERSONA_ANCHOR_LINK_TYPE.into()), LinkMatch::Any)?;

    match persona_specs.len() {
        0 => {
            hdk::debug("create Default persona")?;
            let persona_address = create_default_persona()?;
            let default_result = GetLinksLoadResult{
                entry: Persona::default(),
                address: persona_address
            };
            Ok(vec![default_result])
        },
        _ => {
            let result = persona_specs.iter().map(|elem| {
                GetLinksLoadResult {
                    entry: Persona {
                        name: elem.entry.name.to_owned(),
                        fields: get_fields(&elem.address).unwrap_or(Vec::new())
                    },
                    address: elem.address.clone()
                }
            }).collect();
            Ok(result)
        }
    }
}


pub fn handle_add_field(persona_address: Address, field: PersonaField) -> ZomeApiResult<()> {

    let persona_field_entry = Entry::App(
        PERSONA_FIELD_ENTRY.into(),
        field.into(),
    );

    let field_address = hdk::commit_entry(&persona_field_entry)?;
    hdk::link_entries(&persona_address, &field_address, PERSONA_FIELDS_LINK_TYPE, "")?;
    Ok(())
}

pub fn handle_get_field(persona_address: Address, field_name: String) -> ZomeApiResult<RawString> {
    let fields = get_fields(&persona_address)?;
    match fields.iter().filter(|field| {field.name == field_name}).next() {
        Some(field) => Ok(RawString::from(field.data.to_owned())),
        None => Err(ZomeApiError::Internal("No matching field names".into()))
    }
}


/*=====  End of public fn handlers  ======*/


fn get_fields(persona_address: &Address) -> ZomeApiResult<Vec<PersonaField>> {
    get_links_and_load_type(persona_address, LinkMatch::Exactly(PERSONA_FIELDS_LINK_TYPE.into()), LinkMatch::Any).map(|result: Vec<GetLinksLoadResult<PersonaField>>| {
        result.iter().map(|elem| {
            elem.entry.clone()
        }).collect()
    })
}

fn create_default_persona() -> ZomeApiResult<Address> {
    handle_create_persona(PersonaSpec::default())
}
