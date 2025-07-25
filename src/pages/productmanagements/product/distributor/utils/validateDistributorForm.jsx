import {validateEmail, validateExactLength, validateLength, validateRequired} from '../../../../../utils/Validations';
import * as LABEL from './distributorLabel';
import * as PROPERTY from './distributerFieldProperty';
import * as MESSAGE from '../../../../../utils/const/Message';

export function validateForm(distributor) {
    const formError = {};
    //Name
    if (!validateRequired(distributor.companyName)) formError.companyName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.COMPANY_NAME);
    if (!validateLength(distributor.companyName, PROPERTY.COMPANY_NAME_MIN, PROPERTY.COMPANY_NAME_MAX)) formError.companyName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.COMPANY_NAME).replace(':min', PROPERTY.COMPANY_NAME_MIN).replace(':max', PROPERTY.COMPANY_NAME_MAX);
    //Email
    if (!validateRequired(distributor.email)) formError.email = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.EMAIL);
    if (!validateEmail(distributor.email)) formError.email = MESSAGE.INVALID_EMAIL;
    //Phone 1
    if (!validateRequired(distributor.phoneNo1)) formError.phoneNo1 = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PHONE1);
    if (!validateExactLength(distributor.phoneNo1, PROPERTY.PHONE_LENGTH)) formError.phoneNo1 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.PHONE1).replace(':number', PROPERTY.PHONE_LENGTH);
    //Phone 2
    if (distributor.phoneNo2 && !validateExactLength(distributor.phoneNo2, PROPERTY.PHONE_LENGTH)) formError.phoneNo2 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.PHONE2).replace(':number', PROPERTY.PHONE_LENGTH);
    //Address
    if (!validateRequired(distributor.address)) formError.address = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ADDRESS);
    if (!validateLength(distributor.address, PROPERTY.ADDRESS_MIN, PROPERTY.ADDRESS_MAX)) formError.address = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.COMPANY_NAME).replace(':min', PROPERTY.ADDRESS_MIN).replace(':max', PROPERTY.ADDRESS_MAX);
    ;
    return formError;
}