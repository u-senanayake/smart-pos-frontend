import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Stack, Container, Breadcrumbs } from "@mui/material";

//Service
import InventoryService from "../../../services/InventoryService";

//Style
import { formatDateToYYYYMMDD } from '../../../utils/Dateutils';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as ROUTES from '../../../utils/const/RouteProperty';
import DataTable from "../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../components/PageElements/Buttons";
import { PageTitle } from "../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../components/PageElements/Loading";
import { PreviewIcon } from "../../../components/PageElements/IconButtons";
import { Home } from "../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { useStyles } from "../../../style/makeStyle";

const InventoryList = () => {

    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const classes = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        InventoryService.getAllInventoryItems()
            .then((res) => {
                setInventories(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace('type', LABEL.INVENTORY), error);
                setError(MESSAGE.FEATCHING_ERROR_MSG.replace('type', LABEL.INVENTORY));
                setLoading(false);
            });
    }, []);

    const columns = [
        {
            field: 'productId',
            headerName: LABEL.TABLE_ID,
            flex: 0.5,
            headerClassName: 'super-app-theme--header',
            valueGetter: (value, row) => `${row.product.productId}`,
        },
        {
            field: 'productName',
            headerName: LABEL.TABLE_NAME,
            flex: 1.5,
            headerClassName: 'super-app-theme--header',
            valueGetter: (value, row) => `${row.product.productName}`,
        },
        {
            field: 'category',
            headerName: LABEL.TABLE_CATEGORY,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            valueGetter: (value, row) => `${row.product.category.name}`,
        },
        {
            field: 'distributor',
            headerName: LABEL.TABLE_DISTRIBUTOR,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            valueGetter: (value, row) => `${row.product.distributor.companyName}`,
        },
        {
            field: 'quantity',
            headerName: LABEL.TABLE_QTY,
            flex: 0.5,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'stockWarningLevel',
            headerName: LABEL.TABLE_WARLEVEL,
            flex: 0.5,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'stockAlertLevel',
            headerName: LABEL.TABLE_ALRLEVEL,
            flex: 0.5,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'lastUpdated',
            headerName: LABEL.TABLE_LAST_UPDATED_DATE,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            valueGetter: (value, row) => `${formatDateToYYYYMMDD(row.lastUpdated)}`,
        },
        {
            field: 'action',
            headerName: LABEL.TABLE_ACTION,
            flex: 0.5,
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
                        <PreviewIcon url={ROUTES.PRODUCT_VIEW.replace(':id', params.row.product.id)} />
                    </Stack>
                );
            },
        },
    ]

    function handleClick(event) {
        navigate(event.target.href);
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

    if (loading) {
        return <SkeletonLoading />;
    }

    if (error) {
        return (
            <ErrorMessage message={error} actionText="Retry" onAction={() => window.location.reload()} />
        );
    }

    if (inventories.length === 0) {
        return (
            <div className={classes.errorTitle}>
                <Typography variant="h6">{MESSAGE.LIST_EMPTY.replace('type', LABEL.INVENTORY)}</Typography>
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
            <PageTitle title={LABEL.PAGE_TITLE_LIST.replace(':type', LABEL.INVENTORY)} />
            <div style={{ marginBottom: "10px" }}>
                <AddNewButton url={ROUTES.PRODUCT_CREATE} />
            </div >
            <DataTable rows={inventories} columns={columns} getRowId={(row) => row.inventoryId} />
        </Container >
    );
};

export default InventoryList;