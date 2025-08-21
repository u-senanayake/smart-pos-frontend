import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, Typography, Box } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { ErrorAlert, SuccessAlert, } from '../../../../components/DialogBox/Alerts';
import { ReadOnlyField3, EditableTextField } from "../../../../components/PageElements/CommonElements";

import SaleItemService from "../../../../services/SaleItemService";
import SaleService from '../../../../services/SaleService';
import ProductService from "../../../../services/ProductService";

const PaymentDialog = ({ open, onClose, saleId, }) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [sale, setSale] = useState(null);

    useEffect(() => {
        if (open) {
            setErrorMessage(null);
            setSuccessMessage('');
            fetchData();
        }
    }, [open]);


    const fetchData = async () => {
        try {
            if (!saleId) {
                setErrorMessage('Sale ID is missing.');
                return;
            }
            const saleResponse = await SaleService.getSaleById(saleId);
            setSale(saleResponse.data);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage('Fetching sale item: ' + error.response.data);
            } else {
                console.error("Error fetching products:", error);
            }
        }
    };


    const handleUpdateItem = async () => {
        // setIsSaving(true);
        setErrorMessage(null);
        try {
            // const sid = Number(saleId);
            // const iid = Number(itemId);
            // if (!sid || !iid) {
            //     setIsSaving(false);
            //     setErrorMessage('Sale ID or Item ID is missing or invalid.');
            //     return;
            // }
            // const requestData = {
            //     ...salesItem,
            //     quantity: qty,
            //     itemDiscountVal: lineDiscountVal,
            //     itemDiscountPer: lineDiscountPer,
            //     totalPrice: calculatedPrice,
            // };
            // delete requestData.product;
            // delete requestData.salesIId;
            // delete requestData.returnedQuantity;

            // await SaleItemService.updateSaleItem(sid, iid, requestData);
            // setSuccessMessage('Sale item updated successfully.');
            // setIsSaving(false);
            // onClose(true); // Pass true to indicate update
        } catch (error) {
            // setIsSaving(false);
            // setErrorMessage('Failed to update sale item: ' + (error.response?.data || error.message));
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>{"Change Item"}</DialogTitle>
            <DialogContent>
                <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                <ErrorAlert message={errorMessage} />
                <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                        <ReadOnlyField3 label={'Sale ID'} value={sale?.saleId} />
                    </Grid2>
                    <Grid2 size={8}>
                        <ReadOnlyField3 label={'Customer'} value={sale?.customer?.firstName} />
                    </Grid2>
                    <Grid2 size={8}>
                        <Typography variant="h6">Total</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                        {/* <Typography variant="h6" >${(sale.totalAmount || 0).toFixed(2)}</Typography> */}
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                {/* <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <Button onClick={handleDeleteItem} color="error" variant='contained' disabled={isSaving | isDeleting}>
                        {isSaving ? 'Deleting...' : 'Delete'}
                    </Button>
                </Box>
                <Button onClick={() => onClose(false)} color="secondary" disabled={isSaving | isDeleting}>
                    Cancel
                </Button>
                <Button onClick={handleUpdateItem} color="primary" disabled={isSaving | isDeleting}>
                    {isDeleting ? 'Updating...' : 'Update'}
                </Button> */}
            </DialogActions>
        </Dialog>
    );
};
export default PaymentDialog;