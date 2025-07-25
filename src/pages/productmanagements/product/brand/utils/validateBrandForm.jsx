import {validateLength, validateRequired} from '../../../../../utils/Validations';
import * as LABEL from './brandLabel';
import * as PROPERTY from './brandFieldProperty';
import * as MESSAGE from '../../../../../utils/const/Message';

export function validateForm(brand) {
    const errors = {};
    //Name
    if (!validateRequired(brand.name)) errors.name = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.NAME);
    if (!validateLength(brand.name, PROPERTY.NAME_MIN, PROPERTY.NAME_MAX)) errors.name = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.NAME).replace(':min', PROPERTY.NAME_MIN).replace(':max', PROPERTY.NAME_MAX);
    //Description
    if (!validateRequired(brand.description)) errors.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.DESCRIPTION);
    if (!validateLength(brand.description, PROPERTY.DESC_MIN, PROPERTY.DESC_MAX)) errors.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.DESCRIPTION).replace(':min', PROPERTY.DESC_MIN).replace(':max', PROPERTY.DESC_MAX);

    return errors;
}