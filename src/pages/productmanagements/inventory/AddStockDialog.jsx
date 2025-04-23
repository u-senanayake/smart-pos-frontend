import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import InventoryService from '../../../services/InventoryService'
import { validateNumberField } from '../../../utils/Validations'
import { SuccessAlert, ErrorAlert, } from '../../../components/DialogBox/Alerts';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import { EditableTextField, ReadOnlyField } from "../../../components/PageElements/CommonElements";

const AddStockDialog = ({ open, onClose, productId, inventory, onStockAdded }) => {
    const [quantity, setQuantity] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);//Error message for user
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    //Clear form when open dialogbox
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
            formError.quantity = MESSAGE.FIELD_REQUIRED.replace(':fieldName', LABEL.INVENTORY_QTY);
        } else if (isNaN(inventory.quantity) || Number(inventory.quantity) <= 0) {
            formError.quantity = MESSAGE.NUMBER_POSITIVE.replace(':fieldName', LABEL.INVENTORY_QTY);
        }
        return formError;
    };

    //Add stock
    const handleAddStock = () => {
        setIsSaving(true);
        const newInventory = { quantity: Number(quantity) }; // Ensure quantity is a number
        const validationErrors = validateForm(newInventory);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            setIsSaving(false);
        } else {
            InventoryService.addStock(productId, newInventory)
                .then(() => {
                    setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.INVENTORY)); // Set success message
                    onStockAdded();
                    setTimeout(() => onClose(), APP_PROPERTY.ALERT_TIMEOUT); // Delay navigation
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.INVENTORY));
                    }
                    console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.INVENTORY), error.response);
                })
                .finally(() => setIsSaving(false));
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{LABEL.PAGE_TITLE_ADD_STOCK}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the details to add stock for the product (Product ID: {productId}).
                </DialogContentText>
                <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                <ErrorAlert message={errorMessage} />
                <ReadOnlyField label={LABEL.INVENTORY_QTY_CRNT} value={inventory?.quantity} />

                <EditableTextField
                    label={LABEL.INVENTORY_QTY}
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
                <Button onClick={handleAddStock} color="primary" disabled={isSaving}>
                    {isSaving ? 'Adding...' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStockDialog;