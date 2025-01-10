import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";
//Service
import CustomerService from '../../services/CustomerService';
//Utils
import { renderStatusIcon, renderLockIcon } from "../../utils/utils";
import { formatDate } from "../../utils/Dateutils";
import { Loading, ReadOnlyField, ErrorMessage } from '../../utils/FieldUtils'

const ViewCustomer = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        CustomerService.getCustomerById(customerId)
            .then((res) => {
                setCustomer(res.data);
            })
            .catch((error) => {
                console.error('Error fetching customer:', error);
                setError("Failed to fetch customer. Please try again later.");
            }).finally(() => setLoading(false));
    }, [customerId]);

    const cancel = () => navigate('/customermanagement/customerlist');

    const handleUpdate = () => {
        navigate(`/customermanagement/customer/updatecustomer/${customerId}`);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                actionText="Retry"
                onAction={() => window.location.reload()}
            />
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    View Customer
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                        <ReadOnlyField label="Customer ID" value={customer.customerId} />
                    </Grid2>
                    <Grid2 size={8}><ReadOnlyField label="Username" value={customer.username} /></Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Customer Group" value={customer.customerGroup.name} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Name" value={`${customer.firstName} ${customer.lastName}`} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Email" value={customer.email} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Phone" value={customer.phoneNo1} />
                    </Grid2>
                    <Grid2 size={12}>
                        <ReadOnlyField label="Address" value={customer.address} />
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="h5">Enabled: {renderStatusIcon(customer.enabled)}</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="h5">Locked: {renderLockIcon(customer.locked)}</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Created At" value={formatDate(customer.createdAt)} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Created By" value={`${customer.createdUser.firstName} ${customer.createdUser.lastName} (${customer.createdUser.username})`} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Updated At" value={formatDate(customer.updatedAt)} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Updated By" value={`${customer.updatedUser.firstName} ${customer.updatedUser.lastName} (${customer.updatedUser.username})`} />
                    </Grid2>
                    {customer.deleted && (
                        <>
                            <Grid2 size={6}>
                                <ReadOnlyField label="Deleted At" value={formatDate(customer.deletedAt)} />
                            </Grid2>
                            <Grid2 size={6}>
                                <ReadOnlyField label="Deleted By" value={`${customer.deletedUser?.firstName} ${customer.deletedUser?.lastName} (${customer.deletedUser?.username})`} />
                            </Grid2>
                        </>
                    )}
                </Grid2>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={cancel}>
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ViewCustomer;