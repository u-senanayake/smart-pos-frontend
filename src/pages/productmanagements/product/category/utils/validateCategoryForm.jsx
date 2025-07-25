import {validateExactLength, validateLength, validateRequired} from '../../../../../utils/Validations';
import * as LABEL from './categoryLabel';
import * as PROPERTY from './categoryFieldProperty';
import * as MESSAGE from '../../../../../utils/const/Message';

export function validateForm(category) {
    const formError = {};
    //Name
    if (!validateRequired(category.name)) formError.name = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.NAME);
    if (!validateLength(category.name, PROPERTY.NAME_MIN, PROPERTY.NAME_MAX)) formError.name = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.NAME).replace(':min', PROPERTY.NAME_MIN).replace(':max', PROPERTY.NAME_MAX);
    //Description
    if (!validateRequired(category.description)) formError.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.DESCRIPTION);
    if (!validateLength(category.description, PROPERTY.DESC_MIN, PROPERTY.DESC_MAX)) formError.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.DESCRIPTION).replace(':min', PROPERTY.DESC_MIN).replace(':max', PROPERTY.DESC_MAX);
    //Category prefix
    if (!validateRequired(category.catPrefix)) formError.catPrefix = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PREFIX);
    if (!validateExactLength(category.catPrefix, PROPERTY.PREFIX_LENGTH)) formError.catPrefix = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.PREFIX).replace(':number', PROPERTY.PREFIX_LENGTH);

    return formError;
}