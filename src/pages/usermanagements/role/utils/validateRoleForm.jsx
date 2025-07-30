import { validateLength, validateRequired } from '../../../../utils/Validations';
import * as LABEL from './roleLabel';
import * as PROPERTY from './roleFieldProperty';
import * as MESSAGE from '../../../../utils/const/Message';

export function validateForm(role) {
    const formError = {};
    if (!validateRequired(role.roleName)) formError.roleName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ROLE_NAME);
    if (!validateLength(role.roleName, PROPERTY.ROLE_NAME_MIN, PROPERTY.ROLE_NAME_MAX)) formError.roleName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.ROLE_NAME).replace(':min', PROPERTY.ROLE_NAME_MIN).replace(':max', PROPERTY.ROLE_NAME_MAX);
    if (!validateRequired(role.description)) formError.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ROLE_DESC);
    if (!validateLength(role.description, PROPERTY.ROLE_DESC_MIN, PROPERTY.ROLE_DESC_MAX)) formError.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.ROLE_DESC).replace(':min', PROPERTY.ROLE_DESC_MIN).replace(':max', PROPERTY.ROLE_DESC_MAX);
    return formError;
}