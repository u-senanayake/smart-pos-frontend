import {validateEmail, validateExactLength, validateLength, validateRequired} from '../../../../utils/Validations';
import * as LABEL from './customerLabels';
import * as MESSAGE from '../../../../utils/const/Message';
import * as PROPERTY from './customerFieldProperty';

export function validateForm(customer) {
    const errors = {};
    //Username
    if (!validateRequired(customer.username)) errors.username = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTOMER_USERNAME);
    if (!validateLength(customer.username, PROPERTY.USERNAME_MIN, PROPERTY.USERNAME_MAX)) errors.username = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CUSTOMER_USERNAME).replace(':min', PROPERTY.USERNAME_MIN).replace(':max', PROPERTY.USERNAME_MAX);
    //First Name
    if (!validateRequired(customer.firstName)) errors.firstName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTOMER_FIRST_NAME);
    if (!validateLength(customer.firstName, PROPERTY.NAME_MIN, PROPERTY.NAME_MAX)) errors.firstName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CUSTOMER_FIRST_NAME).replace(':min', PROPERTY.NAME_MIN).replace(':max', PROPERTY.NAME_MAX);
    //Last Name
    if (!validateRequired(customer.lastName)) errors.lastName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTOMER_LAST_NAME);
    if (!validateLength(customer.lastName, PROPERTY.NAME_MIN, PROPERTY.NAME_MAX)) errors.lastName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CUSTOMER_LAST_NAME).replace(':min', PROPERTY.NAME_MIN).replace(':max', PROPERTY.NAME_MAX);
    //Email
    if (!validateRequired(customer.email)) errors.email = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTOMER_EMAIL);
    if (!validateEmail(customer.email)) errors.email = MESSAGE.INVALID_EMAIL;
    //Phone Number
    if (!validateRequired(customer.phoneNo1)) errors.phoneNo1 = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTOMER_PHONE);
    if (!validateExactLength(customer.phoneNo1, PROPERTY.PHONE_LENGTH)) errors.phoneNo1 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.CUSTOMER_PHONE1).replace(':number', PROPERTY.USER_PHONE_LENGTH);
    //Address
    if (!validateRequired(customer.address)) errors.address = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTOMER_ADDRS);
    if (!validateLength(customer.address, PROPERTY.ADDRESS_MIN, PROPERTY.ADDRESS_MAX)) errors.address = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.CUSTOMER_ADDRS).replace(':min', PROPERTY.ADDRESS_MIN).replace(':max', PROPERTY.ADDRESS_MAX);
    //Customer Group
    if (!validateRequired(customer.customerGroup)) errors.customerGroup = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.CUSTOMER_GROUP);

    return errors;
}