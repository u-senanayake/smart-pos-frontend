import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Box, Typography } from '@mui/material';

import InventoryService from '../../../services/InventoryService';
import { Loading, ReadOnlyField } from "../../../utils/FieldUtils";
import { validateRequired, } from '../../../utils/Validations';

const AddStockDialog = ({ open, onClose, productId }) => {

  const [inventory, setInventory] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (open) {
      // Reset form and errors
      setQuantity('');
      setFormError({});
      setServerError('');
      setLoading(true);
  
      // Fetch latest inventory data
      InventoryService.getProductStockDetails(productId)
        .then((res) => {
          setInventory(res.data);
        })
        .catch((error) => console.error('Error fetching inventory:', error))
        .finally(() => setLoading(false));
    }
  }, [open, productId]);
  

  const handleAddStock = (e) => {
    e.preventDefault();
    const inventory = { productId, quantity };
    const validationErrors = validateForm(inventory);

    if (Object.keys(validationErrors).length > 0) {
      setFormError(validationErrors);
    } else {
      setIsSaving(true);
      InventoryService.addStock(inventory)
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Error adding stock:", error);
          setServerError(error.response?.data?.message || 'Error adding stock');
        }).finally(() => setIsSaving(false));
    }
  };

  const handleClose = () => {
    setQuantity('');
    setFormError({});
    setServerError('');
    onClose();
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

  if (loading) {
    return <Loading />;
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Stock</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the details to add stock for the product (Product ID: {productId}).
        </DialogContentText>
        {serverError && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error">
              {serverError}
            </Typography>
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          <ReadOnlyField label="Current Quantity" value={inventory.quantity} />
        </Box>
        <TextField
          autoFocus
          margin="dense"
          name="quantity"
          label="Adding Quantity"
          type="number"
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          variant="outlined"
          error={!!formError.quantity}
          helperText={formError.quantity}
          inputProps={{ 'aria-label': 'adding quantity' }}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={isSaving}>
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