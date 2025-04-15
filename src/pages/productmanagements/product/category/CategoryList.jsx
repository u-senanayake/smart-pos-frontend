import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Stack, Container, Breadcrumbs } from "@mui/material";

import DataTable from "../../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../../components/PageElements/Buttons";
import { PageTitle } from "../../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../../components/PageElements/Loading";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../../components/PageElements/IconButtons";
import { Home } from "../../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../../components/DialogBox/DeleteConfirmDialog";

//Service
import CategoryService from "../../../../services/CategoryService";
//Utils
import { renderStatusIcon } from "../../../../utils/utils";

import * as LABEL from '../../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../../utils/const/Message';
import * as ROUTES from '../../../../utils/const/RouteProperty';

//Style
import { useStyles } from "../../../../style/makeStyle";

const CategoryList = () => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    CategoryService.getCategories()
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace('type', LABEL.CATEGORY), error);
        setError(MESSAGE.FEATCHING_ERROR_MSG.replace('type', LABEL.CATEGORY));
        setLoading(false);
      });
  }, []);

  const deleteCategory = (id) => {
    CategoryService.deleteCategory(id)
      .then(() => setCategories(categories.filter((category) => category.categoryId !== id)))
      .catch((error) => {
        console.error(MESSAGE.DELETE_ERROR.replace('type', LABEL.CATEGORY), error);
        setError(MESSAGE.DELETE_ERROR_MSG.replace('type', LABEL.CATEGORY));
      });
  };

  function handleClick(event) {
    navigate(event.target.href);
  }

  const columns = [
    {
      field: 'name',
      headerName: LABEL.TABLE_NAME,
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'description',
      headerName: LABEL.TABLE_DESCRIPTION,
      flex: 2,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'catPrefix',
      headerName: LABEL.TABLE_CAT_PRFX,
      flex: 0.7,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'active',
      headerName: LABEL.TABLE_STATUS,
      flex: 0.5,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => renderStatusIcon(params.row.enabled),
    },
    {
      field: 'action',
      headerName: LABEL.TABLE_ACTION,
      flex: 1,
      sortable: false,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = (e) => {
          const currentRow = params.row;
          return alert(JSON.stringify(currentRow, null, 4));
        };
        return (
          <Stack direction="row" spacing={2}>
            <EditIcon url={ROUTES.CATEGORY_UPDATE.replace(':categoryId', params.row.categoryId)} />
            <DeleteIcon
              onClick={() => {
                setSelectedId(params.row.categoryId);
                setDialogOpen(true);
              }}
            />
            <PreviewIcon url={ROUTES.CATEGORY_VIEW.replace(':categoryId', params.row.categoryId)} />
          </Stack>
        );
      },
    },
  ];

  if (loading) {
    return <SkeletonLoading />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} actionText="Retry" onAction={() => window.location.reload()} />
    );
  }

  if (categories.length === 0) {
    return (
      <div className={classes.errorTitle}>
        <Typography variant="h6">{MESSAGE.LIST_EMPTY.replace('type', LABEL.CATEGORY)}</Typography>
        <AddNewButton url={ROUTES.CATEGORY_CREATE} />
      </div>
    );
  }

  return (
    <Container className={classes.mainContainer}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Home />
          <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>Category List</Typography>
        </Breadcrumbs>
      </div>
      <PageTitle title={LABEL.PAGE_TITLE_LIST.replace(':type', LABEL.CATEGORY)} />
      <div style={{ marginBottom: "10px" }}>
        <AddNewButton url={ROUTES.CATEGORY_CREATE} />
      </div >
      <DataTable rows={categories} columns={columns} getRowId={(row) => row.categoryId} />
      <DeleteConfirmDialog open={dialogOpen} onDelete={deleteCategory} onCancel={() => setDialogOpen(false)} id={selectedId} />
    </Container>
  );
};

export default CategoryList;