import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2,} from "@mui/material";

import BrandService from '../../../services/BrandService';
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";
import { Loading } from '../../../utils/FieldUtils'

const ViewBrand = () => {

    const { brandId } = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  useEffect(() => {
    BrandService.getBrandById(brandId)
      .then((res) => {
        setBrand(res.data);
      })
      .catch((error) => console.error('Error fetching brand:', error))
      .finally(() => setLoading(false));
  }, [brandId]);

  const cancel = () => navigate('/productmanagement/brandlist');
  
  if (loading) {
    return <Loading />;
  }

  if (!brand) {
      return (
        <Container maxWidth="sm">
          <Typography variant="h6" color="error">
            Brand not found.
          </Typography>
        </Container>
      );
  }

  const handleUpdate = () => {
    navigate(`/productmanagement/brand/updatebrand/${brandId}`);
  };

return (
    <Container maxWidth="md">
        <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                View Brand
            </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Brand ID"
                value={brand.brandId}
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
          <Grid2 item xs={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Name"
                value={brand.name}
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
                label="Description"
                value={brand.description}
                fullWidth
                slotProps={{
                    input: {
                        readOnly: true,
                    },}}
                variant="outlined"
                margin="normal"
            />
        </Box>
        <Box sx={{ mb: 2 }}>
            <Typography variant="h5">Enabled: {renderStatusIcon(brand.enabled)}</Typography>
        </Box>
        <TextField
            label="Created At"
            value={formatDate(brand.createdAt)}
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
            value={`${brand.createdUser.firstName} ${brand.createdUser.lastName} (${brand.createdUser.username})`}
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
            value={formatDate(brand.updatedAt)}
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
            value={`${brand.updatedUser.firstName} ${brand.updatedUser.lastName} (${brand.updatedUser.username})`}
            fullWidth
            slotProps={{
            input: {
              readOnly: true,
            },}}
            variant="outlined"
            margin="normal"
          />
          {brand.deleted && (
            <>
              <TextField
                label="Deleted At"
                value={formatDate(brand.deletedAt)}
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
                value={`${brand.deletedUser?.firstName} ${brand.deletedUser?.lastName} (${brand.deletedUser?.username})`}
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
export default ViewBrand;
