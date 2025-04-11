import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, Grid2, } from "@mui/material";
//Service
import BrandService from '../../../../services/BrandService';
//Utils
import { renderStatusIcon, } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/Dateutils";
import { Loading, ReadOnlyField, ErrorMessage } from '../../../../utils/FieldUtils'

const ViewBrand = () => {

  const { brandId } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    BrandService.getBrandById(brandId)
      .then((res) => {
        setBrand(res.data);
      })
      .catch((error) => {
        console.error('Error fetching brand:', error);
        setError("Failed to fetch brand. Please try again later.");
      }).finally(() => setLoading(false));
  }, [brandId]);

  const cancel = () => navigate('/productmanagement/brandlist');

  const handleUpdate = () => {
    navigate(`/productmanagement/brand/updatebrand/${brandId}`);
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
          View Brand
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <ReadOnlyField label="Brand ID" value={brand.brandId} />
          </Grid2>
          <Grid2 size={8}>
            <ReadOnlyField label="Name" value={brand.name} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Description" value={brand.description} />
          </Grid2>
          <Grid2 size={6}>
            <Typography variant="h5">Enabled: {renderStatusIcon(brand.enabled)}</Typography>
          </Grid2>
          <Grid2 size={6}></Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created At" value={formatDate(brand.createdAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created By" value={`${brand.createdUser.firstName} ${brand.createdUser.lastName} (${brand.createdUser.username})`} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated At" value={formatDate(brand.updatedAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated By" value={`${brand.updatedUser.firstName} ${brand.updatedUser.lastName} (${brand.updatedUser.username})`} />
          </Grid2>
          {brand.deleted && (
            <>
              <Grid2 size={6}>
                <ReadOnlyField label="Deleted At" value={formatDate(brand.deletedAt)} />
              </Grid2>
              <Grid2 size={6}>
                <ReadOnlyField label="Deleted By" value={`${brand.deletedUser?.firstName} ${brand.deletedUser?.lastName} (${brand.deletedUser?.username})`} />
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
export default ViewBrand;
