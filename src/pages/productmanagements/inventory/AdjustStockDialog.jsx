import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { ReadOnlyField } from '../../../utils/FieldUtils'
import InventoryService from '../../../services/InventoryService'
import { validateRequired } from '../../../utils/Validations'

const AdjustStockDialog = ({ open, onClose, productId, inventory, onStockAdjusted }) => {
    const [quantity, setQuantity] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState({});

    //Clear form when open dialogbox
    useEffect(() => {
        if (open) {
          setQuantity('');
          setFormError({});
        }
      }, [open]);

    //Add stock
    const handleAdjustStock = () => {
        setIsSaving(true);
        const newInventory = { productId, quantity };
        const validationErrors = validateForm(newInventory);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            setIsSaving(false);
        } else {
            InventoryService.adjustStock(newInventory)
                .then(() => {
                    onStockAdjusted();
                    onClose();
                })
                .catch((error) => {
                    console.error("Error adding stock:", error);
                }).finally(() => setIsSaving(false));
        }
    };

    const validateForm = (inventory) => {
        const formError = {};
        if (!validateRequired(inventory.quantity)) {
            formError.quantity = 'Quantity is required';
        } else if (isNaN(inventory.quantity) || Number(inventory.quantity) <= 0) {
            formError.quantity = 'Quantity must be a positive number';
        }
        return formError;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the details to adjust stock for the product (Product ID: {productId}).
                </DialogContentText>
                <ReadOnlyField label="Current Quantity" value={inventory?.quantity} />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Quantity"
                    type="number"
                    fullWidth
                    variant="outlined"
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