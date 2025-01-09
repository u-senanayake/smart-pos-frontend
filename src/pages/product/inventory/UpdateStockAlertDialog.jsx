import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

const UpdateStockAlertDialog = ({ open, onClose, productId, inventory, onStockAdded }) => {

    const [isSaving, setIsSaving] = useState(false);

    const handleUpdateStockAlerts = () => {

        setIsSaving(true);
        // const newInventory = { productId, quantity };
        // const validationErrors = validateForm(newInventory);
        // if (Object.keys(validationErrors).length > 0) {
        //     setFormError(validationErrors);
        //     setIsSaving(false);
        // } else {
        //     InventoryService.addStock(newInventory)
        //         .then(() => {
        //             onStockAdded();
        //             onClose();
        //         })
        //         .catch((error) => {
        //             console.error("Error adding stock:", error);
        //         }).finally(() => setIsSaving(false));
        // }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the details to add stock for the product (Product ID: {productId}).
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={isSaving}>
                    Cancel
                </Button>
                <Button onClick={handleUpdateStockAlerts} color="primary" disabled={isSaving}>
                    {isSaving ? 'Adding...' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateStockAlertDialog;