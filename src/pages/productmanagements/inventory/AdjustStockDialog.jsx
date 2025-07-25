import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import InventoryService from '../../../services/InventoryService'

import {validateNumberField} from '../../../utils/Validations'
import {ErrorAlert, SuccessAlert,} from '../../../components/DialogBox/Alerts';
import * as LABEL from './utils/inventoryLabel';
import * as MESSAGE from '../../../utils/const/Message';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import {EditableTextField, ReadOnlyField} from "../../../components/PageElements/CommonElements";


const AdjustStockDialog = ({open, onClose, productId, inventory, onStockAdjusted}) => {
    const [quantity, setQuantity] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [successMessage, setSuccessMessage] = useState(''); // State for a success message

    //Clear form when open dialog
    useEffect(() => {
        if (open) {
            setQuantity('');
            setFormError({});
            setErrorMessage(null);
            setSuccessMessage('');
        }
    }, [open]);


    const validateForm = (inventory) => {
        const formError = {};
        if (!validateNumberField(inventory.quantity)) {
            formError.quantity = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.QTY);
        } else if (isNaN(inventory.quantity) || Number(inventory.quantity) <= 0) {
            formError.quantity = MESSAGE.NUMBER_POSITIVE.replace(':fieldName', LABEL.QTY);
        }
        return formError;
    };

    //Add stock
    const handleAdjustStock = () => {
        setIsSaving(true);
        const newInventory = {quantity: Number(quantity)};
        const validationErrors = validateForm(newInventory);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            setIsSaving(false);
        } else {
            InventoryService.decreaseStock(productId, newInventory)
                .then(() => {
                    onStockAdjusted();
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.INVENTORY)); // Set success message
                    setTimeout(() => onClose(), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.INVENTORY));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.INVENTORY), error.response);
                }).finally(() => setIsSaving(false));
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{LABEL.PAGE_TITLE_DECREASE_STOCK}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the details to adjust stock for the product (Product ID: {productId}).
                </DialogContentText>
                <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                <ErrorAlert message={errorMessage}/>
                <ReadOnlyField label={LABEL.QTY_CURRENT} value={inventory?.quantity}/>
                <EditableTextField
                    label={LABEL.QTY}
                    name="quantity"
                    type={"number"}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    error={!!formError.quantity}
                    helperText={formError.quantity}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={isSaving}>
                    Cancel
                </Button>
                <Button onClick={handleAdjustStock} color="primary" disabled={isSaving}>
                    {isSaving ? 'Adjusting...' : 'Adjust'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdjustStockDialog;