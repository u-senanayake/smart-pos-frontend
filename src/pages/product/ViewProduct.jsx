import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";
import AddIcon from "@mui/icons-material/Add";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";

import ProductService from '../../services/ProductService';
import { ReadOnlyField, Loading } from '../../utils/FieldUtils'
import { formatDate } from "../../utils/Dateutils";
import { renderStatusIcon, formatPrice, formatPhoneNumber, } from "../../utils/utils";
import AddStockDialog from '../../pages/product/inventory/AddStockDialog';
import AdjustStockDialog from '../../pages/product/inventory/AdjustStockDialog';

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
  const [openAdjustStockDialog, setOpenAdjustStockDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.getProductById(id)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => console.error('Error fetching product or inventory:', error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStockAdded = () => {
    ProductService.getProductById(product.id)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => console.error('Error fetching updated inventory:', error));
  };

  const handleOpenAdjustStockDialog = () => {
    setOpenAdjustStockDialog(true);
  };

  const handleOpenAddStockDialog = () => {
    setOpenAddStockDialog(true);
  };

  const handleCloseAdjustStockDialog = () => {
    setOpenAdjustStockDialog(false);
  };

  const handleCloseAddStockDialog = () => {
    setOpenAddStockDialog(false);
  };

  const cancel = () => navigate('/productmanagement/productlist');

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Container>
    );
  }

  const handleUpdate = () => {
    navigate(`/productmanagement/product/updateproduct/${id}`);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          View Product
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="ID" value={product.id} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Product ID" value={product.productId} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Code" value={product.sku} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Name" value={product.productName} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Description" value={product.description} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Category" value={product.category.name} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Selling Price" value={formatPrice(product.price)} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Cost Price" value={formatPrice(product.costPrice)} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Min Price" value={formatPrice(product.minPrice)} />
            </Box>
          </Grid2>
        </Grid2>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5">Enabled: {renderStatusIcon(product.enabled)}</Typography>
        </Box>
        <ReadOnlyField label="Created At" value={formatDate(product.createdAt)} />
        <ReadOnlyField label="Created By" value={`${product.createdUser.firstName} ${product.createdUser.lastName} (${product.createdUser.username})`} />
        <ReadOnlyField label="Updated At" value={formatDate(product.updatedAt)} />
        <ReadOnlyField label="Updated By" value={`${product.updatedUser.firstName} ${product.updatedUser.lastName} (${product.updatedUser.username})`} />
        {product.deleted && (
          <>
            <ReadOnlyField label="Deleted At" value={formatDate(product.deletedAt)} />
            <ReadOnlyField label="Deleted By" value={`${product.deletedUser?.firstName} ${product.deletedUser?.lastName} (${product.deletedUser?.username})`} />
          </>
        )}
      </Paper>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Distributor
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="ID" value={product.distributor.id} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Name" value={product.distributor.name} />
            </Box>
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Email" value={product.distributor.email} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Phone 1" value={formatPhoneNumber(product.distributor.phoneNo1)} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Phone 2" value={formatPhoneNumber(product.distributor.phoneNo2)} />
            </Box>
          </Grid2>
        </Grid2>
        <Box sx={{ mb: 2 }}>
          <ReadOnlyField label="Address" value={formatPhoneNumber(product.distributor.address)} />
        </Box>
      </Paper>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Inventory
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Quantity" value={product.inventory.quantity} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Stock Warning Level" value={formatPrice(product.inventory.stockWarningLevel)} />
            </Box>
          </Grid2>
          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Stock Alert Level" value={formatPrice(product.inventory.stockAlertLevel)} />
            </Box>
          </Grid2>

          <Grid2 item xs={4}>
            <Box sx={{ mb: 2 }}>
              <ReadOnlyField label="Last Updated" value={formatDate(product.inventory.lastUpdated)} />
            </Box>
          </Grid2>
        </Grid2>
        <Box sx={{ display: 'flex', mt: 2, gap: 4 }}>
          <Button variant="contained" startIcon={<AddIcon />} color="info" onClick={handleOpenAddStockDialog}>
            Add Stock
          </Button>
          <AddStockDialog open={openAddStockDialog} onClose={handleCloseAddStockDialog} productId={product.id} inventory={product.inventory} onStockAdded={handleStockAdded}/>
          <Button variant="contained" startIcon={<UpdateIcon />} color="secondary" onClick={handleOpenAdjustStockDialog}>
            Adjust Stock
          </Button>
          <AdjustStockDialog open={openAdjustStockDialog} onClose={handleCloseAdjustStockDialog} productId={product.id} inventory={product.inventory} onStockAdjusted={handleStockAdded}/>
        </Box>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate} productId={product.id}>
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
    </Container>
  );
};
export default ViewProduct;