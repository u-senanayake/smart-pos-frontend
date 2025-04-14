import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, Stack, Container, Breadcrumbs } from "@mui/material";
import { Add, } from "@mui/icons-material";

import DataTable from "../../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../../components/PageElements/Buttons";
import { PageTitle } from "../../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../../components/PageElements/Loading";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../../components/PageElements/IconButtons";
import { Home } from "../../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../../components/DialogBox/DeleteConfirmDialog";

//Service
import BrandService from "../../../../services/BrandService";
//Utils
import { renderStatusIcon } from "../../../../utils/utils";

import * as LABEL from '../../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../../utils/const/Message';
import * as ROUTES from '../../../../utils/const/RouteProperty';

//Style
import { useStyles } from "../../../../style/makeStyle";

const BrandList = () => {

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    BrandService.getBrands()
      .then((res) => {
        setBrands(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(MESSAGE.BRAND_FEATCHING_ERROR, error);
        setError(MESSAGE.BRAND_FEATCHING_ERROR_MSG);
        setLoading(false);
      });
  }, []);

  const deleteBrand = (id) => {
    BrandService.deleteBrand(id)
      .then(() => setBrands(brands.filter((brand) => brand.brandId !== id)))
      .catch((error) => {
        console.error(MESSAGE.BRAND_DELETE_ERROR, error);
        setError(MESSAGE.BRAND_DELETE_ERROR_MSG);
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
      headerName: LABEL.DESCRIPTION,
      flex: 2,
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
            <EditIcon url={ROUTES.BRAND_UPDATE.replace(':brandId', params.row.brandId)} />
            <DeleteIcon
              onClick={() => {
                setSelectedId(params.row.brandId);
                setDialogOpen(true);
              }}
            />
            <PreviewIcon url={ROUTES.BRAND_VIEW.replace(':brandId', params.row.brandId)} />
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

  if (brands.length === 0) {
    return (
      <div className={classes.errorTitle}>
        <Typography variant="h6">{MESSAGE.BRAND_LIST_EMPTY}</Typography>
        <AddNewButton url={ROUTES.BRAND_CREATE} />
      </div>
    );
  }

  return (
    <Container className={classes.mainContainer}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Home />
          <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>Brand List</Typography>
        </Breadcrumbs>
      </div>
      <PageTitle title={LABEL.PAGE_TITLE_BRAND_LIST} />
      <div style={{ marginBottom: "10px" }}>
        <AddNewButton url={ROUTES.BRAND_CREATE} />
      </div >
      <DataTable rows={brands} columns={columns} getRowId={(row) => row.brandId} />
      <DeleteConfirmDialog open={dialogOpen} onDelete={deleteBrand} onCancel={() => setDialogOpen(false)} id={selectedId} />
    </Container>
  );
};

export default BrandList;