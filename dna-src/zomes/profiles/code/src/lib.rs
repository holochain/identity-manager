#![feature(proc_macro_hygiene)]
#[macro_use]
extern crate hdk;
extern crate hdk_proc_macros;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate holochain_json_derive;

use hdk_proc_macros::zome;

use hdk::{
    error::ZomeApiResult,
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

pub mod profile;
pub type Base = RawString;

pub static PROFILE_ENTRY: &str = "profile";
pub static FIELD_MAPPING_ENTRY: &str = "field_mapping";
pub static PROFILE_ANCHOR_ENTRY: &str = "profile_anchor";

pub static FIELD_MAPPINGS_LINK_TYPE: &str = "field_mappings";
pub static PROFILES_LINK_TYPE: &str = "profiles";


#[zome]
pub mod profiles {
    
    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
    pub fn profile_entry_def() -> ValidatingEntryType {
        profile::profile_definition()
    }

    #[entry_def]
    pub fn field_mapping_entry_def() -> ValidatingEntryType {
        profile::field_mapping_definition()
    }

    #[entry_def]
    pub fn profile_anchor_entry_def() -> ValidatingEntryType {
        entry!(
            name: PROFILE_ANCHOR_ENTRY,
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
                    PROFILE_ENTRY,
                    link_type: PROFILES_LINK_TYPE,
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
    pub fn register_app(spec: profile::ProfileSpec) -> ZomeApiResult<(Address)> {
        profile::handlers::handle_register_app(spec)
    }

    #[zome_fn("hc_public")]
    pub fn get_profiles() -> ZomeApiResult<Vec<profile::Profile>> {
        profile::handlers::handle_get_profiles()
    }

    #[zome_fn("hc_public")]
    pub fn create_mapping(mapping: profile::ProfileMapping) -> ZomeApiResult<profile::MapFieldsResult> {
        profile::handlers::handle_create_mapping(mapping)
    }


    #[zome_fn("hc_public")]
    pub fn retrieve(retriever_dna: Address, profile_field: String) -> ZomeApiResult<RawString> {
        profile::handlers::handle_retrieve(retriever_dna, profile_field)
    }

}
