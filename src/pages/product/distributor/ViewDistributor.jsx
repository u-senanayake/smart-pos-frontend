import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";

//Service
import DistributorService from '../../../services/DistributorService';
//Utils
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";
import { Loading, ReadOnlyField, ErrorMessage } from '../../../utils/FieldUtils'

const ViewDistributor = () => {

    const { distributorId } = useParams();
    const [distributor, setDistributor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        DistributorService.getDistributorById(distributorId)
            .then((res) => {
                setDistributor(res.data);
            })
            .catch((error) => {
                console.error('Error fetching distributor:', error);
                setError("Failed to fetch distributor. Please try again later.");
            }).finally(() => setLoading(false));
    }, [distributorId]);


    const cancel = () => navigate('/productmanagement/distributorlist');

    const handleUpdate = () => {
        navigate(`/productmanagement/distributor/updatedistributor/${distributorId}`);
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
                    View Distributor
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                        <ReadOnlyField label="Distributor ID" value={distributor.distributorId} />
                    </Grid2>
                    <Grid2 size={8}>
                        <ReadOnlyField label="Compnay Name" value={distributor.companyName} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Email" value={distributor.email} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Phone" value={`${distributor.phoneNo1} / ${distributor.phoneNo2} `} />
                    </Grid2>
                    <Grid2 size={12}>
                        <ReadOnlyField label="Address" value={distributor.address} />
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="h5">Enabled: {renderStatusIcon(distributor.enabled)}</Typography>
                    </Grid2>
                    <Grid2 size={6}></Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Created At" value={formatDate(distributor.createdAt)} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Created By" value={`${distributor.createdUser.firstName} ${distributor.createdUser.lastName} (${distributor.createdUser.username})`} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Updated At" value={formatDate(distributor.updatedAt)} />
                    </Grid2>
                    <Grid2 size={6}>
                        <ReadOnlyField label="Updated By" value={`${distributor.updatedUser.firstName} ${distributor.updatedUser.lastName} (${distributor.updatedUser.username})`} />
                    </Grid2>
                    {distributor.deleted && (
                        <>
                            <Grid2 size={6}>
                                <ReadOnlyField label="Deleted At" value={formatDate(distributor.deletedAt)} />
                            </Grid2>
                            <Grid2 size={6}>
                                <ReadOnlyField label="Deleted By" value={`${distributor.deletedUser?.firstName} ${distributor.deletedUser?.lastName} (${distributor.deletedUser?.username})`} />
                            </Grid2>
                        </>
                    )}

                </Grid2>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={cancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};
export default ViewDistributor;
