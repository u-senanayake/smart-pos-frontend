import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Stack, Container, Breadcrumbs } from "@mui/material";

import DataTable from "../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../components/PageElements/Buttons";
import { PageTitle } from "../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../components/PageElements/Loading";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../components/PageElements/IconButtons";
import { Home } from "../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../components/DialogBox/DeleteConfirmDialog";

//Service
import ProductService from "../../../services/ProductService";
//Utils
import { renderStatusIcon, } from "../../../utils/utils";
//Style
import { useStyles } from "../../../style/makeStyle";

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as ROUTES from '../../../utils/const/RouteProperty';

const ProductList = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    ProductService.getProducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace('type', LABEL.PRODUCT), error);
        setError(MESSAGE.FEATCHING_ERROR_MSG.replace('type', LABEL.PRODUCT));
        setLoading(false);
      });
  }, []);

  const deleteProduct = (id) => {
    ProductService.deleteProduct(id)
      .then(() => setProducts(products.filter((product) => product.productId !== id)))
      .catch((error) => {
        console.error(MESSAGE.DELETE_ERROR.replace('type', LABEL.PRODUCT), error);
        setError(MESSAGE.DELETE_ERROR_MSG.replace('type', LABEL.PRODUCT));
      });
  }

  function handleClick(event) {
    navigate(event.target.href);
  }

  const columns = [
    {
      field: 'productId',
      headerName: LABEL.TABLE_ID,
      flex: 0.5,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'productName',
      headerName: LABEL.TABLE_NAME,
      flex: 2,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'category',
      headerName: LABEL.TABLE_CATEGORY,
      flex: 1.5,
      headerClassName: 'super-app-theme--header',
      valueGetter: (value, row) => `${row.category.name}`,
    },
    {
      field: 'price',
      headerName: LABEL.TABLE_PRICE,
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'active',
      headerName: LABEL.TABLE_STATUS,
      flex: 0.8,
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
            <EditIcon url={ROUTES.PRODUCT_UPDATE.replace(':id', params.row.id)} />
            <DeleteIcon
              onClick={() => {
                setSelectedId(params.row.id);
                setDialogOpen(true);
              }}
            />
            <PreviewIcon url={ROUTES.PRODUCT_VIEW.replace(':id', params.row.id)} />
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


  if (products.length === 0) {
    return (
      <div className={classes.errorTitle}>
        <Typography variant="h6">{MESSAGE.LIST_EMPTY.replace('type', LABEL.PRODUCT)}</Typography>
        <AddNewButton url={ROUTES.PRODUCT_CREATE} />
      </div>
    );
  }

  return (
    <Container className={classes.mainContainer}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Home />
          <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>Product List</Typography>
        </Breadcrumbs>
      </div>
      <PageTitle title={LABEL.PAGE_TITLE_LIST.replace(':type', LABEL.PRODUCT)} />
      <div style={{ marginBottom: "10px" }}>
        <AddNewButton url={ROUTES.PRODUCT_CREATE} />
      </div >
      <DataTable rows={products} columns={columns} getRowId={(row) => row.id} />
      <DeleteConfirmDialog open={dialogOpen} onDelete={deleteProduct} onCancel={() => setDialogOpen(false)} id={selectedId} />
    </Container>
  );
};

export default ProductList;