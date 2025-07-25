import {validateLength, validateRequired} from "../../../../utils/Validations";
import * as MESSAGE from "../../../../utils/const/Message";
import * as LABEL from "./customerGroupLabels";
import * as PROPERTY from "./customerGroupFieldProperty";

export function validateForm(group) {
    const errors = {};
    //Name
    if (!validateRequired(group.name)) errors.name = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.NAME);
    if (!validateLength(group.name, PROPERTY.NAME_MIN, PROPERTY.NAME_MAX)) errors.name = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.NAME).replace(':min', PROPERTY.NAME_MIN).replace(':max', PROPERTY.NAME_MAX);
    //Description
    if (!validateRequired(group.description)) errors.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.DESC);
    if (!validateLength(group.description, PROPERTY.DESC_MIN, PROPERTY.DESC_MAX)) errors.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.DESC).replace(':min', PROPERTY.DESC_MIN).replace(':max', PROPERTY.DESC_MAX);

    return errors;
}