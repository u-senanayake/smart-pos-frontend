import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DistributorService from '../../../services/DistributorService';
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";

import { Container, Typography, Box, Paper, CircularProgress, Button, TextField, Grid2,} from "@mui/material";

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
        return (
          <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Container>
        );
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
                  View Category
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Distributor ID"
                            value={distributor.distributorId}
                            fullWidth
                            slotProps={{
                            input: {
                                readOnly: true,
                            },
                            }}
                            variant="outlined"
                            margin="normal"
                        />
                        </Box>
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Compnay Name"
                            value={distributor.companyName}
                            fullWidth
                            slotProps={{
                            input: {
                                readOnly: true,
                            },
                            }}
                            variant="outlined"
                            margin="normal"
                        />
                        </Box>
                    </Grid2>
                </Grid2>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Email"
                        value={distributor.email}
                        fullWidth
                        slotProps={{
                        input: {
                            readOnly: true,
                        },
                        }}
                        variant="outlined"
                        margin="normal"
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Phone"
                        value={`${distributor.phoneNo1} / ${distributor.phoneNo2} `}
                        fullWidth
                        slotProps={{
                        input: {
                            readOnly: true,
                        },
                        }}
                        variant="outlined"
                        margin="normal"
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Address"
                        value={distributor.address}
                        fullWidth
                        slotProps={{
                        input: {
                            readOnly: true,
                        },
                        }}
                        variant="outlined"
                        margin="normal"
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5">Enabled: {renderStatusIcon(distributor.enabled)}</Typography>
                </Box>
                <TextField
                    label="Created At"
                    value={formatDate(distributor.createdAt)}
                    fullWidth
                    slotProps={{
                    input: {
                    readOnly: true,
                    },}}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    label="Created By"
                    value={`${distributor.createdUser.firstName} ${distributor.createdUser.lastName} (${distributor.createdUser.username})`}
                    fullWidth
                    slotProps={{
                    input: {
                    readOnly: true,
                    },}}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    label="Updated At"
                    value={formatDate(distributor.updatedAt)}
                    fullWidth
                    slotProps={{
                    input: {
                    readOnly: true,
                    },}}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    label="Updated By"
                    value={`${distributor.updatedUser.firstName} ${distributor.updatedUser.lastName} (${distributor.updatedUser.username})`}
                    fullWidth
                    slotProps={{
                    input: {
                    readOnly: true,
                    },}}
                    variant="outlined"
                    margin="normal"
                />
                {distributor.deleted && (
                    <>
                    <TextField
                        label="Deleted At"
                        value={formatDate(distributor.deletedAt)}
                        fullWidth
                        slotProps={{
                        input: {
                        readOnly: true,
                        },}}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        label="Deleted By"
                        value={`${distributor.deletedUser?.firstName} ${distributor.deletedUser?.lastName} (${distributor.deletedUser?.username})`}
                        fullWidth
                        slotProps={{
                        input: {
                        readOnly: true,
                        },}}
                        variant="outlined"
                        margin="normal"
                    />
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
