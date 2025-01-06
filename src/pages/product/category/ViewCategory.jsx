import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CategoryService from '../../../services/CategoryService';
import { renderStatusIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";
import { Loading } from '../../../utils/FieldUtils'

import { Container, Typography, Box, Paper, Button, TextField, Grid2,} from "@mui/material";

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
              <TextField
                label="Category ID"
                value={category.categoryId}
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
                label="Name"
                value={category.name}
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
                label="Category Prefix"
                value={category.catPrefix}
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
                value={category.description}
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
            <Typography variant="h5">Enabled: {renderStatusIcon(category.enabled)}</Typography>
          </Box>
          <TextField
            label="Created At"
            value={formatDate(category.createdAt)}
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
            value={`${category.createdUser.firstName} ${category.createdUser.lastName} (${category.createdUser.username})`}
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
            value={formatDate(category.updatedAt)}
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
            value={`${category.updatedUser.firstName} ${category.updatedUser.lastName} (${category.updatedUser.username})`}
            fullWidth
            slotProps={{
            input: {
              readOnly: true,
            },}}
            variant="outlined"
            margin="normal"
          />
          {category.deleted && (
            <>
              <TextField
                label="Deleted At"
                value={formatDate(category.deletedAt)}
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
                value={`${category.deletedUser?.firstName} ${category.deletedUser?.lastName} (${category.deletedUser?.username})`}
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
export default ViewCategory;
