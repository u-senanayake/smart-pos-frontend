import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, Typography, Box } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { ErrorAlert, SuccessAlert, } from '../../../../components/DialogBox/Alerts';
import { ReadOnlyField, ReadOnlyField2, ReadOnlyField3, EditableTextField } from "../../../../components/PageElements/CommonElements";

import SaleItemService from "../../../../services/SaleItemService";
import ProductService from "../../../../services/ProductService";

import NumberPadDilog from './NumberPadDialog';

const SaleItemDialog = ({ open, onClose, saleId, editingItemId: itemId }) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [salesItem, setSalesItem] = useState(null);
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [lineDiscountVal, setLineDiscountval] = useState(0);
    const [lineDiscountPer, setLineDiscountPer] = useState(0);
    const [coupon, setCoupon] = useState(null);
    const [couponAmount, setCouponAmount] = useState(0);
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    const [openNumberPadDialog, setOpenNumberPadDialog] = useState(false);
    const [editingField, setEditingField] = useState(null); 


    useEffect(() => {
        if (open) {
            setErrorMessage(null);
            setSuccessMessage('');
            fetchData();
        }
    }, [open]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (salesItem && salesItem.product && salesItem.product.id) {
                try {
                    const productResponse = await ProductService.getProductById(salesItem.product.id);
                    setProduct(productResponse.data);
                } catch (error) {
                    setErrorMessage('Fetching product: ' + (error.response?.data || error.message));
                }
            }
        };
        fetchProduct();
    }, [salesItem]);

    useEffect(() => {
        if (salesItem) {
            setQty(salesItem.qty || salesItem.quantity || 1);
            setLineDiscountval(salesItem.itemDiscountVal || 0);
            setLineDiscountPer(salesItem.itemDiscountPer || 0);
            setCoupon(salesItem.coupon || 0);
            setCouponAmount(salesItem.couponAmount || 0);
        }
    }, [salesItem]);

    useEffect(() => {
        const unitPrice = product?.price || 0;
        const lineDiscount = lineDiscountVal == 0 ? (unitPrice / 100 * lineDiscountPer) : lineDiscountVal;
        const total = (qty * (unitPrice - lineDiscount)) - couponAmount;
        setCalculatedPrice(total >= 0 ? total : 0);
    }, [qty, lineDiscountVal, lineDiscountPer, coupon, product]);

    const fetchData = async () => {
        try {
            if (!saleId || !itemId) {
                setErrorMessage('Sale ID or Item ID is missing.');
                return;
            }
            const saleitemResponse = await SaleItemService.getSaleItemBySaleIdAndSalesItemId(saleId, itemId);
            setSalesItem(saleitemResponse.data);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage('Fetching sale item: ' + error.response.data);
            } else {
                console.error("Error fetching products:", error);
            }
        }
    };

    const calculateCoupon = (coupon) => {
        setCouponAmount(0);
    };

    const handleUpdateItem = async () => {
        setIsSaving(true);
        setErrorMessage(null);
        try {
            // Ensure saleId and itemId are numbers and present
            const sid = Number(saleId);
            const iid = Number(itemId);
            if (!sid || !iid) {
                setIsSaving(false);
                setErrorMessage('Sale ID or Item ID is missing or invalid.');
                return;
            }
            const requestData = {
                ...salesItem,
                quantity: qty,
                itemDiscountVal: lineDiscountVal,
                itemDiscountPer: lineDiscountPer,
                totalPrice: calculatedPrice,
            };
            delete requestData.product;
            delete requestData.salesIId;
            delete requestData.returnedQuantity;

            await SaleItemService.updateSaleItem(sid, iid, requestData);
            setSuccessMessage('Sale item updated successfully.');
            setIsSaving(false);
            onClose(true); // Pass true to indicate update
        } catch (error) {
            setIsSaving(false);
            setErrorMessage('Failed to update sale item: ' + (error.response?.data || error.message));
        }
    };

    const handleDeleteItem = async () => {
        setIsDeleting(true);
        try {
            await SaleItemService.deleteSaleItem(itemId);
            setSuccessMessage('Sale item updated successfully.');
            setIsDeleting(false);
            onClose(true); // Pass true to indicate update
        } catch (error) {
            setIsDeleting(false);
            setErrorMessage('Failed to delete sale item: ' + (error.response?.data || error.message));
        }
    };

    // Add logic to disable one discount field if the other is filled
    const isLineDiscountValDisabled = lineDiscountPer > 0;
    const isLineDiscountPerDisabled = lineDiscountVal > 0;

    const handleOpenNumberPadDialog = () => {
        setOpenNumberPadDialog(true);
    };

    const handleCloseNumberPadDialog = () => {
        setOpenNumberPadDialog(false);
        // if (updated && saleId) {
        //     fetchSaleItems(saleId);
        // }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            maxWidth="md"
            fullWidth={true}>
            <DialogTitle>{"Change Item"}</DialogTitle>
            <DialogContent>
                <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
                <ErrorAlert message={errorMessage} />
                <Grid2 container spacing={2}>
                    <Grid2 size={4}><ReadOnlyField3 value={product?.productId} /></Grid2>
                    <Grid2 size={8}><ReadOnlyField3 value={product?.productName} /></Grid2>
                    <Grid2 size={4}>
                        {/* <ReadOnlyField
                            label="Quantity"
                            name="qty"
                            type="number"
                            value={qty}
                            onChange={e => setQty(Number(e.target.value))}
                            onClick={handleOpenNumberPadDialog}
                        /> */}
                        <Typography variant="h6" onClick={handleOpenNumberPadDialog} style={{ cursor: 'pointer' }}>yyyy</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                        <EditableTextField
                            label="Line Discount Value"
                            name="lineDiscountVal"
                            type="number"
                            value={lineDiscountVal}
                            onChange={e => setLineDiscountval(Number(e.target.value))}
                            disabled={isLineDiscountValDisabled}
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <EditableTextField
                            label="Line Discount Percentage"
                            name="lineDiscountPer"
                            type="number"
                            value={lineDiscountPer}
                            onChange={e => setLineDiscountPer(Number(e.target.value))}
                            disabled={isLineDiscountPerDisabled}
                        />
                    </Grid2>
                    <Grid2 size={8}>
                        <EditableTextField
                            label="Coupon"
                            name="coupon"
                            value={coupon}
                            onChange={e => setCoupon(e.target.value)}
                        />
                    </Grid2>
                    <Grid2
                        size={4}
                        display="flex"
                        alignItems="center"
                    >
                        <Button
                            variant="outlined"
                            onClick={() => calculateCoupon(coupon)}
                            fullWidth
                            startIcon={<LocalOfferIcon />}
                            sx={{
                                height: '40%',
                                minHeight: 36,
                            }}
                        >
                            Apply Coupon
                        </Button>
                    </Grid2>
                    <Grid2 size={8}>Total</Grid2>
                    <Grid2 size={4}>
                        <Typography variant="h5" >${calculatedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Grid2>
                </Grid2>
                <NumberPadDilog
                    open={openNumberPadDialog}
                    onClose={handleCloseNumberPadDialog}
                />
            </DialogContent>
            <DialogActions>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <Button onClick={handleDeleteItem} color="error" variant='contained' disabled={isSaving | isDeleting}>
                        {isSaving ? 'Deleting...' : 'Delete'}
                    </Button>
                </Box>
                <Button onClick={() => onClose(false)} color="secondary" disabled={isSaving | isDeleting}>
                    Cancel
                </Button>
                <Button onClick={handleUpdateItem} color="primary" disabled={isSaving | isDeleting}>
                    {isDeleting ? 'Updating...' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default SaleItemDialog;