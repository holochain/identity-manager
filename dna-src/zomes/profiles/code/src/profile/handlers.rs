use std::convert::TryInto;
extern crate serde_json;
extern crate utils;
use hdk::{
    AGENT_ADDRESS,
    holochain_core_types::{
        entry::Entry,
        link::LinkMatch,
    },
    holochain_json_api::{
        json::RawString,
        json::JsonString,
        error::JsonError,
    },
    holochain_persistence_api::{
        cas::content::Address,
    },
    error::{
        ZomeApiResult,
        ZomeApiError,
    }
};

use utils::{
    GetLinksLoadResult,
    get_links_and_load_type
};

use crate::{
	PROFILE_ENTRY,
	PROFILE_ANCHOR_ENTRY,
	FIELD_MAPPING_ENTRY,
	FIELD_MAPPINGS_LINK_TYPE,
	PROFILES_LINK_TYPE,
};

use crate::profile::{
	Profile,
	ProfileSpec,
	ProfileField,
	MapFieldsResult,
};

use crate::profile;


/*=============================================
=            Public zome functions            =
=============================================*/


pub fn handle_register_app(spec: ProfileSpec) -> ZomeApiResult<(Address)> {
    hdk::debug("bridge register profile spec")?;
    let persona_entry = Entry::App(PROFILE_ENTRY.into(), spec.into());
    let anchor_entry = Entry::App(PROFILE_ANCHOR_ENTRY.into(), Address::from(AGENT_ADDRESS.to_string()).into());

	let profile_address = hdk::commit_entry(&persona_entry)?;
	let anchor_address = hdk::commit_entry(&anchor_entry)?;

	hdk::link_entries(&anchor_address, &profile_address, PROFILES_LINK_TYPE, "")?;
    hdk::debug("finish bridge register profile spec")?;
	Ok(profile_address)
}


pub fn handle_get_profiles() -> ZomeApiResult<Vec<Profile>> {
	let anchor_entry = Entry::App(PROFILE_ANCHOR_ENTRY.into(), Address::from(AGENT_ADDRESS.to_string()).into());
	let anchor_address = hdk::commit_entry(&anchor_entry)?;

	let result: Vec<GetLinksLoadResult<ProfileSpec>> = get_links_and_load_type(&anchor_address, LinkMatch::Exactly(PROFILES_LINK_TYPE.into()), LinkMatch::Any)?;

    match result.len() {
        0 => {
            hdk::debug("create Default profile")?;
            let profile_address = create_default_profile()?;

            let default_result = Profile{
                name: ProfileSpec::default().name,
                source_dna: ProfileSpec::default().source_dna,
                hash: profile_address,
                fields: vec!(profile::ProfileField::from_spec(ProfileSpec::default().fields[0].clone(), None)),
                expiry: 0
            };

            Ok(vec![default_result])
        },
        _ => {
            let profiles = result.iter().map(|elem| {
                let spec = elem.entry.clone();
                let mapped_fields = get_mapped_profile_fields(&elem.address).unwrap_or(Vec::new());

                let fields: Vec<profile::ProfileField> = spec.fields.iter().map(|field_spec| {

                    mapped_fields.iter().find(|mapped_field| { mapped_field.entry.name == field_spec.name })
                        .map(|matching_map| matching_map.entry.clone())
                        .unwrap_or(profile::ProfileField::from_spec(field_spec.clone(), None))

                }).collect();

                profile::Profile::from_spec(
                    spec,
                    elem.address.to_owned(),
                    fields,
                )

            }).collect();
            Ok(profiles)
        }
    }
}


pub fn handle_create_mapping(mapping: profile::ProfileMapping) -> ZomeApiResult<MapFieldsResult> {
	let profiles: Vec<profile::Profile> = handle_get_profiles()?;

	// find all the pairs of profiles and fields we need to link together
	let mappings_to_create: Vec<(&profile::Profile, &profile::ProfileField)> =
	profiles.iter().filter(|profile| profile.source_dna == mapping.retriever_dna).flat_map(|profile| {
		profile.fields.iter().filter(|field| field.name == mapping.profile_field_name).map(move |field| (profile, field))
	}).collect();

	// iterate over the pairs to create the mappings and collect the errors/successes
	let (success, errors): (Vec<ZomeApiResult<()>>, Vec<ZomeApiResult<()>>) =
	mappings_to_create.iter().map(|(profile, field)| {
		let new_field = field.new_with_mapping(Some(profile::FieldMapping {
			persona_address: mapping.persona_address.to_owned(),
			persona_field_name: mapping.persona_field_name.to_owned()
		}));

		let field_entry = Entry::App(FIELD_MAPPING_ENTRY.into(), new_field.into());
		let field_hash = hdk::commit_entry(&field_entry)?;
		hdk::link_entries(&profile.hash, &field_hash, FIELD_MAPPINGS_LINK_TYPE, "")?;
		Ok(())
	}).partition(|result| result.is_ok());

	match errors.len() {
		0 => Ok(MapFieldsResult{mappings_created: success.len() as i32}),
		_ => Err(ZomeApiError::Internal(
			format!("An error occurred while creating one of the mappings: {:?}", errors).to_string()
		)),

	}
}


#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
struct GetFieldCallStruct {
	persona_address: Address,
	field_name: String
}

pub fn handle_retrieve(retriever_dna: Address, profile_field: String) -> ZomeApiResult<RawString> {

	let profiles: Vec<profile::Profile> = handle_get_profiles()?;
	let profile = profiles.iter().find(|profile| profile.source_dna == retriever_dna)
		.ok_or(ZomeApiError::Internal("Nothing in the vault".to_string()))?;

	let fields = get_mapped_profile_fields(&profile.hash)?;
	let field = fields.iter().find(|elem| elem.entry.name == profile_field)
		.ok_or(ZomeApiError::Internal("No matching mapped field found in profile".to_string()))?;

	let mapping = field.entry.mapping.clone()
		.ok_or(ZomeApiError::Internal("Field is not mapped".to_string()))?;

	let call_result = hdk::call(
		hdk::THIS_INSTANCE,
		"personas",
		Address::from(hdk::PUBLIC_TOKEN.to_string()),
		"get_field",
		GetFieldCallStruct{
			persona_address: mapping.persona_address.clone(),
			field_name: mapping.persona_field_name.clone()
		}.into()
	)?;
	hdk::debug(format!("Result of calling persona get_field from profiles: {:?}", call_result))?;
	return call_result.try_into()?
}


/*=====  End of Public zome functions  ======*/

fn get_mapped_profile_fields(profile_address: &Address) -> ZomeApiResult<Vec<GetLinksLoadResult<ProfileField>>> {
	get_links_and_load_type(profile_address, LinkMatch::Exactly(FIELD_MAPPINGS_LINK_TYPE.into()), LinkMatch::Any)
}

fn create_default_profile() -> ZomeApiResult<(Address)> {
    handle_register_app(ProfileSpec::default())
}
