use hdk::{
    self,
    entry_definition::ValidatingEntryType,
    holochain_core_types::{
        dna::entry_types::Sharing,
    },
    holochain_json_api::{
    	error::JsonError,
        json::JsonString,
    },
};

use crate::{
    PERSONA_ENTRY,
    PERSONA_FIELD_ENTRY,
    PERSONA_FIELDS_LINK_TYPE
};

pub mod handlers;

#[derive(Serialize, Deserialize, Clone, Debug, DefaultJson)]
pub struct PersonaSpec {
	pub name: String
}

impl Default for PersonaSpec {
    fn default() -> Self {
        Self {
            name: "Default".to_string(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, DefaultJson)]
pub struct Persona {
	name: String,
	fields: Vec<PersonaField> // use &vec if there is a lot of data or it gets copied frequently
}

impl Default for Persona {
    fn default() -> Self {
        Self {
            name: "Default".to_string(),
            fields: Vec::new(),
        }
    }
}


#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct PersonaField {
	name: String,
	data: String
}

pub fn persona_definition() -> ValidatingEntryType {
	entry!(
        name: PERSONA_ENTRY,
        description: "A grouping of data about a user",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<PersonaSpec>| {
            Ok(())
        },

        links: [
            to!(
                PERSONA_FIELD_ENTRY,
                link_type: PERSONA_FIELDS_LINK_TYPE,
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

pub fn field_definition() -> ValidatingEntryType {
	entry!(
        name: PERSONA_FIELD_ENTRY,
        description: "A single piece of data that is attached to a persona",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<PersonaField>| {
            Ok(())
        }
	)
}
