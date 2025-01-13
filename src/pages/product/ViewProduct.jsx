import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, } from "@mui/material";
//Service
import ProductService from '../../services/ProductService';
//Utils
import { ReadOnlyField, Loading, ErrorMessage } from '../../utils/FieldUtils'
import { formatDate } from "../../utils/Dateutils";
import { renderStatusIcon, formatPrice, formatPhoneNumber, } from "../../utils/utils";
//Style
import { styles } from "../../style/TableStyle";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.getProductById(id)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setError("Failed to fetch product. Please try again later.");
      }).finally(() => setLoading(false));
  }, [id]);

  const cancel = () => navigate('/productmanagement/productlist');

  const handleUpdate = () => {
    navigate(`/productmanagement/product/updateproduct/${id}`);
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
        <Typography variant="h4" gutterBottom style={styles.title}>
          View Product
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <ReadOnlyField label="ID" value={product.id} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Product ID" value={product.productId} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Code" value={product.sku} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Name" value={product.productName} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Description" value={product.description} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Category" value={product.category.name} />
          </Grid2>
          <Grid2 size={6}>
            <Typography variant="h5">Enabled: {renderStatusIcon(product.enabled)}</Typography>
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Selling Price" value={formatPrice(product.price)} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Cost Price" value={formatPrice(product.costPrice)} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Min Price" value={formatPrice(product.minPrice)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created At" value={formatDate(product.createdAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Created By" value={`${product.createdUser.firstName} ${product.createdUser.lastName} (${product.createdUser.username})`} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated At" value={formatDate(product.updatedAt)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Updated By" value={`${product.updatedUser.firstName} ${product.updatedUser.lastName} (${product.updatedUser.username})`} />
          </Grid2>
          {product.deleted && (
            <>
              <Grid2 size={6}>
                <ReadOnlyField label="Deleted At" value={formatDate(product.deletedAt)} />
              </Grid2>
              <Grid2 size={6}>
                <ReadOnlyField label="Deleted By" value={`${product.deletedUser?.firstName} ${product.deletedUser?.lastName} (${product.deletedUser?.username})`} />
              </Grid2>
            </>
          )}
        </Grid2>
      </Paper>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Distributor
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <ReadOnlyField label="ID" value={product.distributor.id} />
          </Grid2>
          <Grid2 size={8}>
            <ReadOnlyField label="Name" value={product.distributor.name} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Email" value={product.distributor.email} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Phone" value={`${product.distributor.phoneNo1} / ${product.distributor.phoneNo2} `} />
          </Grid2>
          <Grid2 size={12}>
            <ReadOnlyField label="Address" value={formatPhoneNumber(product.distributor.address)} />
          </Grid2>
        </Grid2>
      </Paper>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Inventory
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <ReadOnlyField label="Quantity" value={product.inventory.quantity} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Stock Warning Level" value={formatPrice(product.inventory.stockWarningLevel)} />
          </Grid2>
          <Grid2 size={4}>
            <ReadOnlyField label="Stock Alert Level" value={formatPrice(product.inventory.stockAlertLevel)} />
          </Grid2>
          <Grid2 size={6}>
            <ReadOnlyField label="Last Updated" value={formatDate(product.inventory.lastUpdated)} />
          </Grid2>
          <Grid2 size={6}></Grid2>
        </Grid2>
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