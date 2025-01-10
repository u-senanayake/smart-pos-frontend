import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";
//Service
import CustomerGroupService from '../../../services/CustomerGroupService';
//Utils
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
    const handleUpdate = () => {
        navigate(`/customermanagement/customergroup/updatecustomergroup/${customerGroupId}`);
    };

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

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    View Customer Group
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                        <ReadOnlyField label="Customer Group ID" value={customerGroup.customerGroupId} />
                    </Grid2>
                    <Grid2 size={8}>
                        <ReadOnlyField label="Name" value={customerGroup.name} />
                    </Grid2>
                    <Grid2 size={12}>
                        <ReadOnlyField label="Description" value={customerGroup.description} />
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="h5">Enabled: {renderStatusIcon(customerGroup.enabled)}</Typography>
                    </Grid2>
                    <Grid2 size={6}></Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Created At" value={formatDate(customerGroup.createdAt)} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Created By" value={`${customerGroup.createdUser.firstName} ${customerGroup.createdUser.lastName} (${customerGroup.createdUser.username})`} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Updated At" value={formatDate(customerGroup.updatedAt)} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Updated By" value={`${customerGroup.updatedUser.firstName} ${customerGroup.updatedUser.lastName} (${customerGroup.updatedUser.username})`} />
                    </Grid2>
                    {customerGroup.deleted && (
                        <>
                            <Grid2 size={6}>
                                <ReadOnlyField label="Deleted At" value={formatDate(customerGroup.deletedAt)} />
                            </Grid2>
                            <Grid2 size={6}>
                                <ReadOnlyField label="Deleted By" value={`${customerGroup.deletedUser?.firstName} ${customerGroup.deletedUser?.lastName} (${customerGroup.deletedUser?.username})`} />
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

export default ViewCustomergroup;
