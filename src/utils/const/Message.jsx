import * as FIELD_PROPERTY from "./FieldProperty";
// Role
export const ROLE_NAME_REQUIRED = "Role name is required";
export const ROLE_NAME_MIN_MAX_LENGTH = `Role name must be between ${FIELD_PROPERTY.ROLE_NAME_MIN} and ${FIELD_PROPERTY.ROLE_NAME_MAX} characters long`;
export const ROLE_DESCRIPTION_REQUIRED = "Description is required";
export const ROLE_DESCRIPTION_MIN_MAX_LENGTH = `Role description must be between ${FIELD_PROPERTY.ROLE_DESCRIPTION_MIN} and ${FIELD_PROPERTY.ROLE_DESCRIPTION_MAX} characters long`;
export const ROLE_CREATE_ERROR = "Error creating role:";
export const ROLE_CREATE_ERROR_MSG = "Error creating role. Please try again later.";
export const ROLE_CREATE_SUCCESS = "Role created successfully!";
export const ROLE_UPDATE_ERROR = "Error updating role:";
export const ROLE_UPDATE_ERROR_MSG = "Error updating role. Please try again later.";
export const ROLE_UPDATE_SUCCESS = "Role updated successfully!";
export const ROLE_DELETE_ERROR = "Error deleting role:";
export const ROLE_DELETE_ERROR_MSG = "Error deleting role. Please try again later.";

export const ROLE_FEATCHING_ERROR = "Error fetching roles:";
export const ROLE_FEATCHING_ERROR_MSG = "Error fetching roles. Please try again later.";