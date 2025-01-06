import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CategoryService from '../../../services/CategoryService';
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";
import { Loading, ReadOnlyField } from '../../../utils/FieldUtils'

import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";

const ViewCategory = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    CategoryService.getCategoryById(categoryId)
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => console.error('Error fetching category:', error))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const cancel = () => navigate('/productmanagement/categorylist');

  if (loading) {
    return <Loading />;
  }

  if (!category) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          Category not found.
        </Typography>
      </Container>
    );
  }

  const handleUpdate = () => {
    navigate(`/productmanagement/category/updatecategory/${categoryId}`);
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
              <ReadOnlyField label="Category ID" value={category.categoryId} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Name" value={category.name} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Category Prefix" value={category.catPrefix} />
            </Box>
          </Grid2>
        </Grid2>
        <Box sx={{ mb: 2 }}>
          <ReadOnlyField label="Description" value={category.description} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5">Enabled: {renderStatusIcon(category.enabled)}</Typography>
        </Box>
        <ReadOnlyField label="Created At" value={formatDate(category.createdAt)} />
        <ReadOnlyField label="Created By" value={`${category.createdUser.firstName} ${category.createdUser.lastName} (${category.createdUser.username})`} />
        <ReadOnlyField label="Updated At" value={formatDate(category.updatedAt)} />
        <ReadOnlyField label="Updated By" value={`${category.updatedUser.firstName} ${category.updatedUser.lastName} (${category.updatedUser.username})`} />
        {category.deleted && (
          <>
            <ReadOnlyField label="Deleted At" value={formatDate(category.deletedAt)} />
            <ReadOnlyField label="Deleted By" value={`${category.deletedUser?.firstName} ${category.deletedUser?.lastName} (${category.deletedUser?.username})`} />
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
export default ViewCategory;
