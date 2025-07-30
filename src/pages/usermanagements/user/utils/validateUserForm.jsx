 import { validateLength, validateRequired, validateEmail, validateExactLength, validatePassword } from '../../../../utils/Validations';
import * as LABEL from './userLabel';
import * as PROPERTY from './userFieldProperty';
import * as MESSAGE from '../../../../utils/const/Message';
 
 export function validateForm  (user)  {
    const errors = {};
    //Username
    if (!validateRequired(user.username)) errors.username = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.USERNAME);
    if (!validateLength(user.username, PROPERTY.USER_USERNAME_MIN, PROPERTY.USER_NAME_MAX)) errors.username = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.USERNAME).replace(':min', PROPERTY.USER_USERNAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    //Role
    if (!validateRequired(user.role)) errors.role = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ROLE);
    //First Name
    if (!validateRequired(user.firstName)) errors.firstName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.FIRST_NAME);
    if (!validateLength(user.firstName, PROPERTY.USER_NAME_MIN, PROPERTY.USER_NAME_MAX)) errors.firstName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.FIRST_NAME).replace(':min', PROPERTY.USER_NAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    //Last Name
    if (!validateRequired(user.lastName)) errors.lastName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.LAST_NAME);
    if (!validateLength(user.lastName, PROPERTY.USER_NAME_MIN, PROPERTY.USER_NAME_MAX)) errors.lastName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.LAST_NAME).replace(':min', PROPERTY.USER_NAME_MIN).replace(':max', PROPERTY.USER_NAME_MAX);
    //Email
    if (!validateRequired(user.email)) errors.email = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.EMAIL);
    if (!validateEmail(user.email)) errors.email = MESSAGE.INVALID_EMAIL;
    //Address
    if (!validateRequired(user.address)) errors.address = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ADDRS);
    if (!validateLength(user.address, PROPERTY.USER_ADDRESS_MIN, PROPERTY.USER_ADDRESS_MAX)) errors.address = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.ADDRS).replace(':min', PROPERTY.USER_ADDRESS_MIN).replace(':max', PROPERTY.USER_ADDRESS_MAX);
    //Phone 1
    if (!validateRequired(user.phoneNo1)) errors.phoneNo1 = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PHONE1);
    if (!validateExactLength(user.phoneNo1, PROPERTY.USER_PHONE_LENGTH)) errors.phoneNo1 = MESSAGE.FIELD_LENGTH.replace(':fieldName', LABEL.PHONE1).replace(':number', PROPERTY.USER_PHONE_LENGTH);
    //password
    if (!validatePassword(user.password)) errors.password = MESSAGE.FIELD_LENGTH2.replace(':fieldName', LABEL.PASSWORD).replace(':number', PROPERTY.USER_PASS_LENGTH);
    if (user.password !== user.confirmPassword) errors.confirmPassword = MESSAGE.INVALID_PASS;
    return errors;
  }