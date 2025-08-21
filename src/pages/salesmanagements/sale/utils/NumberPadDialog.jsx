import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, Typography, Box } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { ErrorAlert, SuccessAlert, } from '../../../../components/DialogBox/Alerts';
import { ReadOnlyField3, EditableTextField } from "../../../../components/PageElements/CommonElements";

import SaleItemService from "../../../../services/SaleItemService";
import SaleService from '../../../../services/SaleService';
import ProductService from "../../../../services/ProductService";

const NumberPadDilog = ({ open, onClose, type }) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [sale, setSale] = useState(null);
    const [fieldValue, setFieldValue] = useState('');

    const handleNumberClick = (num) => {
        const updated = fieldValue + num; // append digit
        setFieldValue(updated);
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            maxWidth="md"
            fullWidth>
            <DialogTitle>{"Change " + type}</DialogTitle>
            <DialogContent>
                <Grid2 container spacing={1}>
                    <Grid2 item size={12}>
                        <ReadOnlyField3 value={fieldValue} />
                    </Grid2>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <Grid2 item size={4} key={num}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="info"
                                onClick={() => handleNumberClick(num)}
                            >
                                {num}
                            </Button>
                        </Grid2>
                    ))}
                    <Grid2 size={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="info"
                        // onClick={() => handleNumberClick(num)}
                        >
                            {'Enter'}
                        </Button>
                    </Grid2>
                    <Grid2 size={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="info"
                        // onClick={() => handleNumberClick(num)}
                        >
                            {'Clear'}
                        </Button>
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
};
export default NumberPadDilog;