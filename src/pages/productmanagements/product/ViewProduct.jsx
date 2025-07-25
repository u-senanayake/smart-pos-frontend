import { useState, useEffect } from "react";
import { useParams, useNavigate, } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid2, Breadcrumbs, } from "@mui/material";
//Service
import ProductService from '../../../services/ProductService';
//Utils
import { formatDate } from "../../../utils/Dateutils";
import { formatPrice, formatPhoneNumber, } from "../../../utils/utils";

import { Loading, } from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField3, ReadOnlyField2, PageTitle2, NameTitle } from "../../../components/PageElements/CommonElements";
import { Home, ProductList } from "../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../components/PageElements/Buttons";
import { EnabledIcon, } from "../../../components/PageElements/IconButtons";
import { useStyles } from "../../../style/makeStyle";
import ImageSlider from '../../../components/PageElements/ImageSlider';
import {ImageAvatar} from '../../../components/PageElements/ImageAvatar';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';
import * as MESSAGE from '../../../utils/const/Message';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as ROUTES from '../../../utils/const/RouteProperty';


const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    ProductService.getProductById(id)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.PRODUCT), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.PRODUCT));
      }).finally(() => setLoading(false));
  }, [id]);

  // Helper to get image URLs
  const getImageUrls = () => {
    if (!product || !product.images || !Array.isArray(product.images) || product.images.length === 0) return [];
    return product.images
      .filter(img => img && img.imageId)
      .map(img =>
        `${APP_PROPERTY.FILE_SERVER_URL}${APP_PROPERTY.PRODUCT_TYPE}/${product.id}/${img.imageId}`
      );
  };

  const productImageUrls = getImageUrls();

  const handleCancel = () => navigate(ROUTES.PRODUCT_LIST);

  const handleUpdate = () => {
    navigate(ROUTES.PRODUCT_UPDATE.replace(':id', id));
  };

  if (loading) {
    return <Loading />;
  }

  if (errorMessage) {
    return (
      <ErrorMessage
        message={errorMessage}
        actionText="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <Container className={classes.mainContainer}>
      <Breadcrumbs aria-label="breadcrumb">
        <Home />
        <ProductList />
        <Typography sx={{ color: 'text.primary' }}>View Product</Typography>
      </Breadcrumbs>
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4, mb: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <Grid2 container spacing={2} >
                <Grid2 size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><NameTitle value={product.productName} /></Grid2>
                <Grid2 size={12}><ImageSlider imageUrls={productImageUrls} /></Grid2>
              </Grid2>
            </Grid2>
            <Grid2 size={8}>
              <Grid2 container spacing={2}>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.PRODUCT_ID} value={`${product.productId}(${product.id})`} /></Grid2>
                <Grid2 size={6}><ReadOnlyField2 label={LABEL.PRODUCT_SKU} value={product.sku} /></Grid2>
                <Grid2 size={12}><ReadOnlyField2 label={LABEL.PRODUCT_CATEGORY} value={product.category.name} /></Grid2>
                <Grid2 size={4}><ReadOnlyField2 label={LABEL.PRODUCT_SELL_PRICE} value={formatPrice(product.price)} /></Grid2>
                <Grid2 size={4}><ReadOnlyField2 label={LABEL.PRODUCT_COST_PRICE} value={formatPrice(product.costPrice)} /></Grid2>
                <Grid2 size={4}><ReadOnlyField2 label={LABEL.PRODUCT_MIN_PRICE} value={formatPrice(product.minPrice)} /></Grid2>
                <Grid2 size={12}><EnabledIcon enabled={product.enabled} /></Grid2>
                <Grid2 size={12}><ReadOnlyField3 label={LABEL.PRODUCT_DESC} value={product.description} /></Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Paper>
        {/* Distributor */}
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4, mb: 2 }} >
          <PageTitle2 title={LABEL.DISTRIBUTOR} />
          <Grid2 container spacing={2}>
            <Grid2 size={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ImageAvatar type={APP_PROPERTY.DISTRIBUTOR_TYPE} typeId={product.distributor.distributorId} imageId={product.distributor.image.imageId} />
            </Grid2>
            <Grid2 size={3}><ReadOnlyField2 label={LABEL.DISTRIBUTOR_ID} value={product.distributor.distributorId} /></Grid2>
            <Grid2 size={6}><ReadOnlyField2 label={LABEL.DISTRIBUTOR_COMPANYNAME} value={product.distributor.companyName} /></Grid2>
            <Grid2 size={6}><ReadOnlyField2 label={LABEL.DISTRIBUTOR_EMAIL} value={product.distributor.email} /></Grid2>
            <Grid2 size={6}><ReadOnlyField2 label={LABEL.DISTRIBUTOR_PHONE} value={`${product.distributor.phoneNo1} / ${product.distributor.phoneNo2} `} /></Grid2>
            <Grid2 size={12}><ReadOnlyField2 label={LABEL.DISTRIBUTOR_ADDRESS} value={formatPhoneNumber(product.distributor.address)} /></Grid2>
          </Grid2>
        </Paper>
        {/* Inventory */}

        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }} >
          <PageTitle2 title={LABEL.INVENTORY} />
          <Grid2 container spacing={2}>
            <Grid2 size={4}><ReadOnlyField2 label={LABEL.INVENTORY_QTY} value={product.inventory.quantity} /></Grid2>
            <Grid2 size={4}><ReadOnlyField2 label={LABEL.INVENTORY_WAR_LEV} value={formatPrice(product.inventory.stockWarningLevel)} /></Grid2>
            <Grid2 size={4}><ReadOnlyField2 label={LABEL.INVENTORY_ALR_LEV} value={formatPrice(product.inventory.stockAlertLevel)} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.INVENTORY_LAST_UPDATED} value={formatDate(product.inventory.lastUpdated)} /></Grid2>
          </Grid2>
        </Paper>

        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4, mb: 2 }} >
          <Grid2 container spacing={2}>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.PRODUCT_CREATED_AT} value={formatDate(product.createdAt)} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.PRODUCT_CREATED_BY} value={`${product.createdUser.firstName} ${product.createdUser.lastName} (${product.createdUser.username})`} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.PRODUCT_UPDATED_AT} value={formatDate(product.updatedAt)} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.PRODUCT_UPDATED_BY} value={`${product.updatedUser.firstName} ${product.updatedUser.lastName} (${product.updatedUser.username})`} /></Grid2>
            {product.deleted && (
              <>
                <Grid2 size={6}><ReadOnlyField3 label={LABEL.PRODUCT_DELETED_AT} value={formatDate(product.deletedAt)} /></Grid2>
                <Grid2 size={6}><ReadOnlyField3 label={LABEL.PRODUCT_DELETED_BY} value={`${product.deletedUser?.firstName} ${product.deletedUser?.lastName} (${product.deletedUser?.username})`} /></Grid2>
              </>
            )}
          </Grid2>
        </Paper>
        <Box className={classes.formButtonsContainer}>
          <EditButton onClick={handleUpdate} />
          <CancelButton onClick={handleCancel} />
        </Box>
      </Container>
    </Container >
  );
};
export default ViewProduct;