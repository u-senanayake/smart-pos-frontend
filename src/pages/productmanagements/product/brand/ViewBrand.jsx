import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid2, Breadcrumbs, } from "@mui/material";
//Service
import BrandService from '../../../../services/BrandService';
//Utils
import { formatDate } from "../../../../utils/Dateutils";

import { Loading, } from "../../../../components/PageElements/Loading";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField, PageTitle } from "../../../../components/PageElements/CommonElements";
import { Home, BrandList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { EnabledIcon, } from "../../../../components/PageElements/IconButtons";

import { useStyles } from "../../../../style/makeStyle";

import * as MESSAGE from '../../../../utils/const/Message';
import * as LABEL from '../../../../utils/const/FieldLabels';
import * as ROUTES from '../../../../utils/const/RouteProperty';

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
        <Typography sx={{ color: 'text.primary' }}>View Role</Typography>
      </Breadcrumbs>
      <PageTitle title={LABEL.PAGE_TITLE_VIEW.replace(':type', LABEL.BRAND) + brand.name} />
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.BRAND_ID} value={brand.brandId} />
            </Grid2>
            <Grid2 size={8}>
              <ReadOnlyField label={LABEL.BRAND_NAME} value={brand.name} />
            </Grid2>
            <Grid2 size={12}>
              <ReadOnlyField label={LABEL.BRAND_DESC} value={brand.description} />
            </Grid2>
            <Grid2 size={6}>
              <EnabledIcon enabled={brand.enabled} />
            </Grid2>
            <Grid2 size={6}></Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.BRAND_CREATED_AT} value={formatDate(brand.createdAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.BRAND_CREATED_BY} value={`${brand.createdUser.firstName} ${brand.createdUser.lastName} (${brand.createdUser.username})`} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.BRAND_UPDATED_AT} value={formatDate(brand.updatedAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.BRAND_UPDATED_BY} value={`${brand.updatedUser.firstName} ${brand.updatedUser.lastName} (${brand.updatedUser.username})`} />
            </Grid2>
            {brand.deleted && (
              <>
                <Grid2 size={6}>
                  <ReadOnlyField label={LABEL.BRAND_DELETED_AT} value={formatDate(brand.deletedAt)} />
                </Grid2>
                <Grid2 size={6}>
                  <ReadOnlyField label={LABEL.BRAND_DELETED_BY} value={`${brand.deletedUser?.firstName} ${brand.deletedUser?.lastName} (${brand.deletedUser?.username})`} />
                </Grid2>
              </>
            )}
          </Grid2>
          <Box className={classes.formButtonsContainer}>
            <EditButton onClick={handleUpdate} />
            <CancelButton onClick={handleCancel} />
          </Box>
        </Paper>
      </Container>
    </Container>
  );
};
export default ViewBrand;
