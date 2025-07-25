import {validateLength, validateNumberField, validateRequired} from '../../../../utils/Validations';
import * as LABEL from './productLabel';
import * as PROPERTY from './productFieldProperty';
import * as MESSAGE from '../../../../utils/const/Message';

export function validateForm(prodcut) {
    const formError = {};
    //Product Name
    if (!validateRequired(prodcut.productName)) formError.productName = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_NAME);
    if (!validateLength(prodcut.productName, PROPERTY.NAME_MIN, PROPERTY.NAME_MAX)) formError.productName = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.PRODUCT_NAME).replace(':min', PROPERTY.NAME_MIN).replace(':max', PROPERTY.NAME_MAX);
    //Description
    if (!validateRequired(prodcut.description)) formError.description = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_DESC);
    if (!validateLength(prodcut.description, PROPERTY.DESC_MIN, PROPERTY.DESC_MAX)) formError.description = MESSAGE.FIELD_MIN_MAX.replace(':fieldName', LABEL.PRODUCT_DESC).replace(':min', PROPERTY.DESC_MIN).replace(':max', PROPERTY.DESC_MAX);
    //SKU
    if (!validateRequired(prodcut.sku)) formError.sku = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_SKU);
    //Category
    if (!validateRequired(prodcut.category)) formError.category = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_CATEGORY);
    //Distributor
    if (!validateRequired(prodcut.distributor)) formError.distributor = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_DISTRIBUTOR);
    //Price
    if (!validateNumberField(prodcut.price)) formError.price = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_SELL_PRICE);
    //Cost Price
    if (!validateNumberField(prodcut.costPrice)) formError.costPrice = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_COST_PRICE);
    //Max Discount
    if (!validateNumberField(prodcut.minPrice)) formError.minPrice = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_MIN_PRICE);
    //Initial Stock
    if (!validateNumberField(prodcut.initialStock)) formError.initialStock = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.INVENTORY_INI_STOCK);
    //Stock Warning Level
    if (!validateNumberField(prodcut.stockWarningLevel)) formError.stockWarningLevel = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.INVENTORY_WAR_LEV);
    //Stock Alert Level
    if (!validateNumberField(prodcut.stockAlertLevel)) formError.stockAlertLevel = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.INVENTORY_ALR_LEV);
    //Manufacture Date
    if (!validateRequired(prodcut.manufactureDate)) formError.manufactureDate = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_MANUFACTURE_DATE);
    //Expiry Date
    if (!validateRequired(prodcut.expireDate)) formError.expireDate = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.PRODUCT_EXPIRE_DATE);

    return formError;
}