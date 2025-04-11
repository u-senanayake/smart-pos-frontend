import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";
//Service
import CategoryService from '../../../../services/CategoryService';
//Utils
import { renderStatusIcon, } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/Dateutils";
import { Loading, ReadOnlyField, ErrorMessage } from '../../../../utils/FieldUtils';

const ViewCategory = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    CategoryService.getCategoryById(categoryId)
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => {
        console.error('Error fetching category:', error);
        setError("Failed to fetch category. Please try again later.");
      }).finally(() => setLoading(false));
  }, [categoryId]);

  const cancel = () => navigate('/productmanagement/categorylist');

  const handleUpdate = () => {
    navigate(`/productmanagement/category/updatecategory/${categoryId}`);
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
          View Category
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <ReadOnlyField label="Category ID" value={category.categoryId} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Name" value={category.name} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Category Prefix" value={category.catPrefix} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Description" value={category.description} />
          </Grid2>
          <Grid2 size={6}>
            <Typography variant="h5">Enabled: {renderStatusIcon(category.enabled)}</Typography>
          </Grid2>
          <Grid2 size={6}></Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created At" value={formatDate(category.createdAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created By" value={`${category.createdUser.firstName} ${category.createdUser.lastName} (${category.createdUser.username})`} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated At" value={formatDate(category.updatedAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated By" value={`${category.updatedUser.firstName} ${category.updatedUser.lastName} (${category.updatedUser.username})`} />
          </Grid2>
          {category.deleted && (
            <>
              <Grid2 size={6}>
                <ReadOnlyField label="Deleted At" value={formatDate(category.deletedAt)} />
              </Grid2>
              <Grid2 size={6}>
                <ReadOnlyField label="Deleted By" value={`${category.deletedUser?.firstName} ${category.deletedUser?.lastName} (${category.deletedUser?.username})`} />
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
export default ViewCategory;
