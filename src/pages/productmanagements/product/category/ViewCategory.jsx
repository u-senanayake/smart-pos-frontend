import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid2, Breadcrumbs } from "@mui/material";
//Service
import CategoryService from '../../../../services/CategoryService';
//Utils
import { formatDate } from "../../../../utils/Dateutils";

import { Loading, } from "../../../../components/PageElements/Loading";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField, PageTitle } from "../../../../components/PageElements/CommonElements";
import { Home, CategoryList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { EnabledIcon, } from "../../../../components/PageElements/IconButtons";
import { useStyles } from "../../../../style/makeStyle";

import * as MESSAGE from '../../../../utils/const/Message';
import * as LABEL from '../../../../utils/const/FieldLabels';
import * as ROUTES from '../../../../utils/const/RouteProperty';

const ViewCategory = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    CategoryService.getCategoryById(categoryId)
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CATEGORY), error);
        setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG);
      }).finally(() => setLoading(false));
  }, [categoryId]);

  const handleCancel = () => navigate(ROUTES.CATEGORY_LIST);

  const handleUpdate = () => {
    navigate(ROUTES.CATEGORY_UPDATE.replace(':categoryId', categoryId))
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
        <CategoryList />
        <Typography sx={{ color: 'text.primary' }}>View Role</Typography>
      </Breadcrumbs>
      <PageTitle title={LABEL.PAGE_TITLE_VIEW.replace(':type', LABEL.CATEGORY) + category.name} />
      <Container maxWidth="lg">
        <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.CATEGORY_ID} value={category.categoryId} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.CATEGORY_NAME} value={category.name} />
            </Grid2>
            <Grid2 size={4}>
              <ReadOnlyField label={LABEL.CATEGORY_PREFX} value={category.catPrefix} />
            </Grid2>
            <Grid2 size={12}>
              <ReadOnlyField label={LABEL.CATEGORY_DESC} value={category.description} />
            </Grid2>
            <Grid2 size={6}>
              <EnabledIcon enabled={category.enabled} />
            </Grid2>
            <Grid2 size={6}></Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.CATEGORY_CREATED_AT} value={formatDate(category.createdAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.CATEGORY_CREATED_BY} value={`${category.createdUser.firstName} ${category.createdUser.lastName} (${category.createdUser.username})`} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.CATEGORY_UPDATED_AT} value={formatDate(category.updatedAt)} />
            </Grid2>
            <Grid2 size={6}>
              <ReadOnlyField label={LABEL.CATEGORY_UPDATED_BY} value={`${category.updatedUser.firstName} ${category.updatedUser.lastName} (${category.updatedUser.username})`} />
            </Grid2>
            {category.deleted && (
              <>
                <Grid2 size={6}>
                  <ReadOnlyField label={LABEL.CATEGORY_DELETED_AT} value={formatDate(category.deletedAt)} />
                </Grid2>
                <Grid2 size={6}>
                  <ReadOnlyField label={LABEL.CATEGORY_DELETED_BY} value={`${category.deletedUser?.firstName} ${category.deletedUser?.lastName} (${category.deletedUser?.username})`} />
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
export default ViewCategory;
