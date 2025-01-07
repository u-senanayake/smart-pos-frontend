import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";

import CustomerGroupService from '../../../services/CustomerGroupService';
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";
import { Loading, ReadOnlyField } from '../../../utils/FieldUtils'

const ViewCustomergroup = () => {

    const { customerGroupId } = useParams();
    const [customerGroup, setCustomerGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        CustomerGroupService.getCustomerGroupById(customerGroupId)
            .then((res) => {
                setCustomerGroup(res.data);
            })
            .catch((error) => console.error('Error fetching Customer group :', error))
            .finally(() => setLoading(false));
    }, [customerGroupId]);

    const cancel = () => navigate('/customermanagement/customergrouplist');

    if (loading) {
        return <Loading />;
    }

    if (!customerGroup) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" color="error">
                    Customer group not found.
                </Typography>
            </Container>
        );
    }

    const handleUpdate = () => {
        navigate(`/customermanagement/customergroup/updatecustomergroup/${customerGroupId}`);
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    View Customer Group
                </Typography>
                <ReadOnlyField label="Customer Group ID" value={customerGroup.customerGroupId} />
                <ReadOnlyField label="Name" value={customerGroup.name} />
                <ReadOnlyField label="Description" value={customerGroup.description} />
                <Typography variant="h5">Enabled: {renderStatusIcon(customerGroup.enabled)}</Typography>
                <ReadOnlyField label="Created At" value={formatDate(customerGroup.createdAt)} />
                <ReadOnlyField label="Created By" value={`${customerGroup.createdUser.firstName} ${customerGroup.createdUser.lastName} (${customerGroup.createdUser.username})`} />
                <ReadOnlyField label="Updated At" value={formatDate(customerGroup.updatedAt)} />
                <ReadOnlyField label="Updated By" value={`${customerGroup.updatedUser.firstName} ${customerGroup.updatedUser.lastName} (${customerGroup.updatedUser.username})`} />
                {customerGroup.deleted && (
                    <>
                        <ReadOnlyField label="Deleted At" value={formatDate(customerGroup.deletedAt)} />
                        <ReadOnlyField label="Deleted By" value={`${customerGroup.deletedUser?.firstName} ${customerGroup.deletedUser?.lastName} (${customerGroup.deletedUser?.username})`} />
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

export default ViewCustomergroup;
