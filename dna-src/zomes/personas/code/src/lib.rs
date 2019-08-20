#![feature(proc_macro_hygiene)]
#[macro_use]
extern crate hdk;
extern crate hdk_proc_macros;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate holochain_json_derive;
extern crate utils;

use hdk_proc_macros::zome;

use crate::persona::Persona;
use utils::GetLinksLoadResult;

use hdk::{
    error::{ZomeApiResult},
    entry_definition::ValidatingEntryType,
    holochain_core_types::{
        dna::entry_types::Sharing,
    },
	holochain_persistence_api::{
		cas::content::Address,
	},
	holochain_json_api::{
        json::RawString,
        json::JsonString,
	},
};

pub mod persona;
pub type Base = RawString;

pub static PERSONA_ENTRY: &str = "persona";
pub static PERSONA_FIELD_ENTRY: &str = "persona_field";
pub static PERSONA_ANCHOR_ENTRY: &str = "persona_anchor";

pub static PERSONA_FIELDS_LINK_TYPE: &str = "fields";
pub static PERSONA_ANCHOR_LINK_TYPE: &str = "personas";

#[zome]
pub mod personas {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
    pub fn persona_entry_def() -> ValidatingEntryType {
        persona::persona_definition()
    }

    #[entry_def]
    pub fn persona_field_entry_def() -> ValidatingEntryType {
        persona::field_definition()
    }

    #[entry_def]
    pub fn persona_anchor_entry_def() -> ValidatingEntryType {
        entry!(
            name: PERSONA_ANCHOR_ENTRY,
            description: "",
            sharing: Sharing::Public,

            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::EntryValidationData<Base>| {
                Ok(())
            },

            links: [
                to!(
                    PERSONA_ENTRY,
                    link_type: PERSONA_ANCHOR_LINK_TYPE,
                    validation_package: || {
                        hdk::ValidationPackageDefinition::Entry
                    },
                    validation: | _validation_data: hdk::LinkValidationData| {
                        Ok(())
                    }
                )
            ]
        )
    }


    #[zome_fn("hc_public")]
    pub fn create_persona(spec: persona::PersonaSpec) -> ZomeApiResult<Address> {
        persona::handlers::handle_create_persona(spec)
    }

    #[zome_fn("hc_public")]
    pub fn update_persona(persona_address: Address, spec: persona::PersonaSpec) -> ZomeApiResult<Address> {
        persona::handlers::handle_update_persona(persona_address, spec)
    }

    #[zome_fn("hc_public")]
    pub fn delete_persona(persona_address: Address) -> ZomeApiResult<Address> {
        persona::handlers::handle_delete_persona(persona_address)
    }

    #[zome_fn("hc_public")]
    pub fn get_personas() -> ZomeApiResult<Vec<GetLinksLoadResult<Persona>>> {
        persona::handlers::handle_get_personas()
    }

    #[zome_fn("hc_public")]
    pub fn add_field(persona_address: Address, field: persona::PersonaField) -> ZomeApiResult<()> {
        persona::handlers::handle_add_field(persona_address, field)
    }

    #[zome_fn("hc_public")]
    pub fn get_field(persona_address: Address, field_name: String) -> ZomeApiResult<RawString> {
        persona::handlers::handle_get_field(persona_address, field_name)
    }

}
