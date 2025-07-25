import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import InventoryService from '../../../services/InventoryService'
import {validateNumberField} from '../../../utils/Validations'
import {ErrorAlert, SuccessAlert,} from '../../../components/DialogBox/Alerts';
import * as LABEL from './utils/inventoryLabel';
import * as MESSAGE from '../../../utils/const/Message';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import {EditableTextField,} from "../../../components/PageElements/CommonElements";

const UpdateStockAlertDialog = ({open, onClose, productId, inventory, onStockAdded}) => {

    const [isSaving, setIsSaving] = useState(false);
    const [stockAlertLevel, setStockAlertLevel] = useState('');
    const [stockWarningLevel, setStockWarningLevel] = useState('');
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [successMessage, setSuccessMessage] = useState(''); // State for a success message

    useEffect(() => {
        if (open) {
            setStockAlertLevel(inventory?.stockAlertLevel || ''); // Set the initial value from inventory
            setStockWarningLevel(inventory?.stockWarningLevel || ''); // Set the initial value from inventory
            setFormError({});
            setErrorMessage(null); // Clear error message
            setSuccessMessage(''); // Clear success message
        }
    }, [open, inventory]);

    const validateForm = (newInventory) => {
        const formError = {};
        if (!validateNumberField(newInventory.stockAlertLevel)) {
            formError.stockAlertLevel = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.ALERT_LEVEL);
        } else if (isNaN(newInventory.stockAlertLevel) || Number(newInventory.stockAlertLevel) <= 0) {
            formError.stockAlertLevel = MESSAGE.NUMBER_POSITIVE.replace(':fieldName', LABEL.ALERT_LEVEL);
        }

        if (!validateNumberField(newInventory.stockWarningLevel)) {
            formError.stockWarningLevel = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.WARNING_LEVEL);
        } else if (isNaN(newInventory.stockWarningLevel) || Number(newInventory.stockAlertLevel) <= 0) {
            formError.stockWarningLevel = MESSAGE.NUMBER_POSITIVE.replace(':fieldName', LABEL.WARNING_LEVEL);
        }
        return formError;
    };

    const handleUpdateStockAlerts = () => {

        setIsSaving(true);
        const newInventory = {stockAlertLevel: Number(stockAlertLevel), stockWarningLevel: Number(stockWarningLevel)};
        const validationErrors = validateForm(newInventory);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            setIsSaving(false);
        } else {
            InventoryService.updateStockLevel(productId, newInventory)
                .then(() => {
                    onStockAdded();
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
            <DialogTitle>{LABEL.PAGE_TITLE_UPDATE_ALERT}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the details to add stock for the product (Product ID: {productId}).
                </DialogContentText>
                <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')}/>
                <ErrorAlert message={errorMessage}/>
                <EditableTextField
                    label={LABEL.WARNING_LEVEL}
                    name="stockWarningLevel"
                    type={"number"}
                    value={stockWarningLevel} // Use state variable
                    onChange={(e) => setStockWarningLevel(e.target.value)} // Update state variable
                    error={!!formError.stockWarningLevel}
                    helperText={formError.stockWarningLevel}
                />
                <EditableTextField
                    label={LABEL.ALERT_LEVEL}
                    name="stockAlertLevel"
                    type={"number"}
                    value={stockAlertLevel} // Use state variable
                    onChange={(e) => setStockAlertLevel(e.target.value)} // Update state variable
                    error={!!formError.stockAlertLevel}
                    helperText={formError.stockAlertLevel}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={isSaving}>
                    Cancel
                </Button>
                <Button onClick={handleUpdateStockAlerts} color="primary" disabled={isSaving}>
                    {isSaving ? 'Updating...' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateStockAlertDialog;