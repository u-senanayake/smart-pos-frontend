import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid2, Breadcrumbs, } from "@mui/material";
//Service
import BrandService from '../../../../services/BrandService';
//Utils
import { formatDate } from "../../../../utils/Dateutils";

import { Loading, } from "../../../../components/PageElements/Loading";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField2, ReadOnlyField3, NameTitle } from "../../../../components/PageElements/CommonElements";
import { Home, BrandList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { EnabledIcon, } from "../../../../components/PageElements/IconButtons";
import { ImageAvatar } from '../../../../components/PageElements/ImageAvatar';

import { useStyles } from "../../../../style/makeStyle";

import * as MESSAGE from '../../../../utils/const/Message';
import * as LABEL from '../../../../utils/const/FieldLabels';
import * as ROUTES from '../../../../utils/const/RouteProperty';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';

const ViewBrand = () => {

  const { brandId } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    BrandService.getBrandById(brandId)
      .then((res) => {
        setBrand(res.data);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.BRAND), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.BRAND));
      }).finally(() => setLoading(false));
  }, [brandId]);

  const handleCancel = () => navigate(ROUTES.BRAND_LIST);

  const handleUpdate = () => {
    navigate(ROUTES.BRAND_UPDATE.replace(':brandId', brandId));
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
        <BrandList />
        <Typography sx={{ color: 'text.primary' }}>View Brand</Typography>
      </Breadcrumbs>
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={3}>
              <Grid2 size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><ImageAvatar type={APP_PROPERTY.BRAND_TYPE} typeId={brand.brandId} imageId={brand.image.imageId} /></Grid2>
              <Grid2 size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><NameTitle value={brand.name} /></Grid2>
            </Grid2>
            <Grid2 size={9}>
              <Grid2 container spacing={2}>
                <Grid2 size={4}><ReadOnlyField2 label={LABEL.BRAND_ID} value={brand.brandId} /></Grid2>
                <Grid2 size={6} sx={{ display: 'flex', alignItems: 'center' }}><EnabledIcon enabled={brand.enabled} /></Grid2>
                <Grid2 size={12}><ReadOnlyField3 label={LABEL.BRAND_DESC} value={brand.description} /></Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Paper>
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.BRAND_CREATED_AT} value={formatDate(brand.createdAt)} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.BRAND_CREATED_BY} value={`${brand.createdUser.firstName} ${brand.createdUser.lastName} (${brand.createdUser.username})`} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.BRAND_UPDATED_AT} value={formatDate(brand.updatedAt)} /></Grid2>
            <Grid2 size={6}><ReadOnlyField3 label={LABEL.BRAND_UPDATED_BY} value={`${brand.updatedUser.firstName} ${brand.updatedUser.lastName} (${brand.updatedUser.username})`} /></Grid2>
            {brand.deleted && (
              <>
                <Grid2 size={6}>
                  <ReadOnlyField3 label={LABEL.BRAND_DELETED_AT} value={formatDate(brand.deletedAt)} />
                </Grid2>
                <Grid2 size={6}>
                  <ReadOnlyField3 label={LABEL.BRAND_DELETED_BY} value={`${brand.deletedUser?.firstName} ${brand.deletedUser?.lastName} (${brand.deletedUser?.username})`} />
                </Grid2>
              </>
            )}
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
export default ViewBrand;
