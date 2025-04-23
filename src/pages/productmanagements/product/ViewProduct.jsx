import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Typography, Box, Paper, Button, TextField, Grid2, Breadcrumbs, } from "@mui/material";
//Service
import ProductService from '../../../services/ProductService';
//Utils
import { formatDate } from "../../../utils/Dateutils";
import { renderStatusIcon, formatPrice, formatPhoneNumber, } from "../../../utils/utils";
//Style
import { styles } from "../../../style/TableStyle";

import { Loading, } from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField, PageTitle, PageTitle2 } from "../../../components/PageElements/CommonElements";
import { Home, ProductList } from "../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../components/PageElements/Buttons";
import { EnabledIcon, LockedIcon } from "../../../components/PageElements/IconButtons";
import { useStyles } from "../../../style/makeStyle";

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
        <Typography sx={{ color: 'text.primary' }}>View Role</Typography>
      </Breadcrumbs>
      <PageTitle title={LABEL.PAGE_TITLE_VIEW.replace(':type', LABEL.PRODUCT) + product.productId} />
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4, mb: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.PRODUCT_ID} value={product.id} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.PRODUCT_PRODUCT_ID} value={product.productId} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.PRODUCT_SKU} value={product.sku} />
            </Grid2>
            <Grid2 size={12}>
              <ReadOnlyField label={LABEL.PRODUCT_NAME} value={product.productName} />
            </Grid2>
            <Grid2 size={12}>
              <ReadOnlyField label={LABEL.PRODUCT_DESC} value={product.description} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.PRODUCT_CATEGORY} value={product.category.name} />
            </Grid2>
            <Grid2 size={6}>
              <EnabledIcon enabled={product.enabled} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.PRODUCT_SELL_PRICE} value={formatPrice(product.price)} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.PRODUCT_COST_PRICE} value={formatPrice(product.costPrice)} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.PRODUCT_MIN_PRICE} value={formatPrice(product.minPrice)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.PRODUCT_CREATED_AT} value={formatDate(product.createdAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.PRODUCT_CREATED_BY} value={`${product.createdUser.firstName} ${product.createdUser.lastName} (${product.createdUser.username})`} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.PRODUCT_UPDATED_AT} value={formatDate(product.updatedAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.PRODUCT_UPDATED_BY} value={`${product.updatedUser.firstName} ${product.updatedUser.lastName} (${product.updatedUser.username})`} />
            </Grid2>
            {product.deleted && (
              <>
                <Grid2 size={6}>
                  <ReadOnlyField label={LABEL.PRODUCT_DELETED_AT} value={formatDate(product.deletedAt)} />
                </Grid2>
                <Grid2 size={6}>
                  <ReadOnlyField label={LABEL.PRODUCT_DELETED_BY} value={`${product.deletedUser?.firstName} ${product.deletedUser?.lastName} (${product.deletedUser?.username})`} />
                </Grid2>
              </>
            )}
          </Grid2>
        </Paper>
        <PageTitle2 title={LABEL.DISTRIBUTOR} />
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4, mb: 2 }} >
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.DISTRIBUTOR_ID} value={product.distributor.id} />
            </Grid2>
            <Grid2 size={8}>
              <ReadOnlyField label={LABEL.DISTRIBUTOR_COMPANYNAME} value={product.distributor.name} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.DISTRIBUTOR_EMAIL} value={product.distributor.email} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.DISTRIBUTOR_PHONE} value={`${product.distributor.phoneNo1} / ${product.distributor.phoneNo2} `} />
            </Grid2>
            <Grid2 size={12}>
              <ReadOnlyField label={LABEL.DISTRIBUTOR_ADDRESS} value={formatPhoneNumber(product.distributor.address)} />
            </Grid2>
          </Grid2>
        </Paper>
        <PageTitle2 title={LABEL.INVENTORY} />
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }} >
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.INVENTORY_QTY} value={product.inventory.quantity} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.INVENTORY_WAR_LEV} value={formatPrice(product.inventory.stockWarningLevel)} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.INVENTORY_ALR_LEV} value={formatPrice(product.inventory.stockAlertLevel)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.INVENTORY_LAST_UPDATED} value={formatDate(product.inventory.lastUpdated)} />
            </Grid2>
            <Grid2 size={6}></Grid2>
          </Grid2>
        </Paper>
        <Box className={classes.formButtonsContainer}>
          <EditButton onClick={handleUpdate} />
          <CancelButton onClick={handleCancel} />
        </Box>
      </Container>
    </Container>
  );
};
export default ViewProduct;