import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";

import CustomerService from '../../services/CustomerService';
import { renderStatusIcon, } from "../../utils/utils";
import { formatDate } from "../../utils/Dateutils";
import { Loading, ReadOnlyField } from '../../utils/FieldUtils'

const ViewCustomer = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  useEffect(() => {
    CustomerService.getCustomerById(customerId)
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((error) => console.error('Error fetching brand:', error))
      .finally(() => setLoading(false));
  }, [customerId]);

    const cancel = () => navigate('/customermanagement/customerlist');

    if (loading) {
        return <Loading />;
    }

    if (!customer) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" color="error">
                    Customer not found.
                </Typography>
            </Container>
        );
    }

    const handleUpdate = () => {
        navigate(`/customermanagement/customer/updatecustomer/${customerId}`);
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    View Customer
                </Typography>
                <ReadOnlyField label="Customer ID" value={customer.customerId} />
                <ReadOnlyField label="Customer Group" value={customer.customerGroup.name} />
                <ReadOnlyField label="Name" value={`${customer.firstName} ${customer.lastName}`} />
                <ReadOnlyField label="Email" value={customer.email} />
                <ReadOnlyField label="Phone" value={customer.phoneNo1} />
                <ReadOnlyField label="Address" value={customer.address} />
                <Typography variant="h5">Enabled: {renderStatusIcon(customer.enabled)}</Typography>
                <Typography variant="h5">Enabled: {renderStatusIcon(customer.locked)}</Typography>
                <ReadOnlyField label="Created At" value={formatDate(customer.createdAt)} />
                <ReadOnlyField label="Created By" value={`${customer.createdUser.firstName} ${customer.createdUser.lastName} (${customer.createdUser.username})`} />
                <ReadOnlyField label="Updated At" value={formatDate(customer.updatedAt)} />
                <ReadOnlyField label="Updated By" value={`${customer.updatedUser.firstName} ${customer.updatedUser.lastName} (${customer.updatedUser.username})`} />
                {customer.deleted && (
                    <>
                        <ReadOnlyField label="Deleted At" value={formatDate(customer.deletedAt)} />
                        <ReadOnlyField label="Deleted By" value={`${customer.deletedUser?.firstName} ${customer.deletedUser?.lastName} (${customer.deletedUser?.username})`} />
                    </>
                )}
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