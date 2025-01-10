import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Grid2 } from '@mui/material';

import InventoryService from '../../../services/InventoryService'
const UpdateStockAlertDialog = ({ open, onClose, productId, inventory, onStockAdded }) => {

    const [isSaving, setIsSaving] = useState(false);
    const [stockAlertLevel, setStockAlertLevel] = useState('');
    const [stockWarningLevel, setStockWarningLevel] = useState('');
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState({});

    const handleUpdateStockAlerts = () => {

        setIsSaving(true);
        const newInventory = { stockAlertLevel, stockWarningLevel };
        const validationErrors = validateForm(newInventory);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            setIsSaving(false);
        } else {
            InventoryService.updateStockLevel(productId, newInventory)
                .then(() => {
                    onStockAdded();
                    onClose();
                })
                .catch((error) => {
                    console.error("Error adding stock:", error);
                }).finally(() => setIsSaving(false));
        }
    };

    const validateForm = (inventory) => {
        const formError = {};
        // if (!validateRequired(inventory.quantity)) {
        //     formError.quantity = 'Quantity is required';
        // } else if (isNaN(inventory.quantity) || Number(inventory.quantity) <= 0) {
        //     formError.quantity = 'Quantity must be a positive number';
        // }
        return formError;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the details to add stock for the product (Product ID: {productId}).
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Alert Level"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={inventory.stockAlertLevel}
                    onChange={(e) => setStockAlertLevel(e.target.value)}
                    error={!!formError.stockAlertLevel}
                    helperText={formError.stockAlertLevel}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Warning Level"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={inventory.stockWarningLevel}
                    onChange={(e) => setStockWarningLevel(e.target.value)}
                    error={!!formError.stockWarningLevel}
                    helperText={formError.stockWarningLevel}
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