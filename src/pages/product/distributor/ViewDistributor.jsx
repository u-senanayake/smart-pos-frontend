import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DistributorService from '../../../services/DistributorService';
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";
import { Loading, ReadOnlyField } from '../../../utils/FieldUtils'

import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";

const ViewDistributor = () => {
    const { distributorId } = useParams();
    const [distributor, setDistributor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        DistributorService.getDistributorById(distributorId)
            .then((res) => {
                setDistributor(res.data);
            })
            .catch((error) => console.error('Error fetching distributor:', error))
            .finally(() => setLoading(false));
    }, [distributorId]);


    const cancel = () => navigate('/productmanagement/distributorlist');

    if (loading) {
        return <Loading />;
    }

    if (!distributor) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" color="error">
                    Distributor not found.
                </Typography>
            </Container>
        );
    }

    const handleUpdate = () => {
        navigate(`/productmanagement/distributor/updatedistributor/${distributorId}`);
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    View Distributor
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <ReadOnlyField label="Distributor ID" value={distributor.distributorId} />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                            <ReadOnlyField label="Compnay Name" value={distributor.companyName} />
                        </Box>
                    </Grid2>
                </Grid2>
                <Box sx={{ mb: 2 }}>
                    <ReadOnlyField label="Email" value={distributor.email} />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <ReadOnlyField label="Phone" value={`${distributor.phoneNo1} / ${distributor.phoneNo2} `} />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <ReadOnlyField label="Address" value={distributor.address} />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5">Enabled: {renderStatusIcon(distributor.enabled)}</Typography>
                </Box>
                <ReadOnlyField label="Created At" value={formatDate(distributor.createdAt)} />
                <ReadOnlyField label="Created By" value={`${distributor.createdUser.firstName} ${distributor.createdUser.lastName} (${distributor.createdUser.username})`} />
                <ReadOnlyField label="Updated At" value={formatDate(distributor.updatedAt)} />
                <ReadOnlyField label="Updated By" value={`${distributor.updatedUser.firstName} ${distributor.updatedUser.lastName} (${distributor.updatedUser.username})`} />
                {distributor.deleted && (
                    <>
                        <ReadOnlyField label="Deleted At" value={formatDate(distributor.deletedAt)} />
                        <ReadOnlyField label="Deleted By" value={`${distributor.deletedUser?.firstName} ${distributor.deletedUser?.lastName} (${distributor.deletedUser?.username})`} />
                    </>
                )}
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
