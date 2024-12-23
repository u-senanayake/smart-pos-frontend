import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryService from '../../../services/CategoryService';
import { renderStatusIcon, renderDeletedIcon, } from "../../../utils/utils";
import { formatDate } from "../../../utils/Dateutils";

import { Container, Typography, Box, Paper, CircularProgress, Button, TextField, Grid2,} from "@mui/material";

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
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (!category) {
      return (
        <Container maxWidth="sm">
          <Typography variant="h6" color="error">
            category not found.
          </Typography>
        </Container>
      );
  }

  const handleUpdate = () => {
    navigate(`/productmanagement/category/updatecategory/${categoryId}`);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          View Category
        </Typography>
      </Paper>
    </Container>
  );

};
export default ViewCategory;
