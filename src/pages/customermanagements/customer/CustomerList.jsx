import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Container, Stack, Breadcrumbs } from "@mui/material";

import DataTable from "../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../components/PageElements/Buttons";
import { PageTitle } from "../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../components/PageElements/Loading";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../components/PageElements/IconButtons";
import { Home } from "../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../components/DialogBox/DeleteConfirmDialog";

//Service
import CustomerService from "../../../services/CustomerService";
//Utils
import { renderStatusIcon, renderLockIcon, formatPhoneNumber } from "../../../utils/utils";

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as ROUTES from '../../../utils/const/RouteProperty';
//Style
import { useStyles } from "../../../style/makeStyle";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    const classes = useStyles();

    useEffect(() => {
        CustomerService.getCustomers()
            .then((res) => {
                setCustomers(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace('type', LABEL.CUSTOMER), error);
                setError(MESSAGE.FEATCHING_ERROR_MSG.replace('type', LABEL.CUSTOMER));
                setLoading(false);
            });
    }, []);


    const deleteCustomer = (id) => {
        CustomerService.deleteCustomer(id)
            .then(() => setCustomers(customers.filter((customer) => customer.customerId !== id)))
            .catch((error) => {
                console.error(MESSAGE.DELETE_ERROR.replace('type', LABEL.CUSTOMER), error);
                setError(MESSAGE.CREATE_ERROR_MSG.replace('type', LABEL.CUSTOMER));
            });
    };

    function handleClick(event) {
        navigate(event.target.href);
    }

    const columns = [
        {
            field: 'name',
            headerName: LABEL.TABLE_NAME,
            flex: 2,
            headerClassName: 'super-app-theme--header',
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'phoneNo1',
            headerName: LABEL.TABLE_PHONE,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            valueGetter: (value, row) => formatPhoneNumber(row.phoneNo1),
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
            field: 'lock',
            headerName: LABEL.TABLE_LOCK_STATUS,
            flex: 0.5,
            filterable: false,
            renderCell: (params) => renderLockIcon(params.row.locked),
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
                        <EditIcon url={ROUTES.CUSTOMER_UPDATE.replace(':customerId', params.row.customerId)} />
                        <DeleteIcon
                            onClick={() => {
                                setSelectedId(params.row.customerId);
                                setDialogOpen(true);
                            }}
                        />
                        <PreviewIcon url={ROUTES.CUSTOMER_VIEW.replace(':customerId', params.row.customerId)} />
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

    if (customers.length === 0) {
        return (
            <div className={classes.errorTitle}>
                <Typography variant="h6">{MESSAGE.LIST_EMPTY.replace('type', LABEL.CUSTOMER)}</Typography>
                <AddNewButton url={ROUTES.CUSTOMER_CREATE} />
            </div>
        );
    }

    return (
        <Container className={classes.mainContainer}>
            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Home />
                    <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>Customer List</Typography>
                </Breadcrumbs>
            </div>
            <PageTitle title={LABEL.PAGE_TITLE_LIST.replace(':type', LABEL.CUSTOMER)} />
            <div style={{ marginBottom: "10px" }}>
                <AddNewButton url={ROUTES.CUSTOMER_CREATE} />
            </div >
            <DataTable rows={customers} columns={columns} getRowId={(row) => row.customerId} />
            <DeleteConfirmDialog open={dialogOpen} onDelete={deleteCustomer} onCancel={() => setDialogOpen(false)} id={selectedId} />
        </Container>
    );
};

export default CustomerList;
