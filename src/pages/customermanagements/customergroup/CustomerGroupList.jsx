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
import CustomerGroupService from "../../../services/CustomerGroupService";
//Utils
import { renderStatusIcon } from "../../../utils/utils";
//Style
import { useStyles } from "../../../style/makeStyle";

import * as LABEL from '../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../utils/const/Message';
import * as ROUTES from '../../../utils/const/RouteProperty';

const CustomerGroupList = () => {

    const [customerGroups, setCustomerGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    const classes = useStyles();

    useEffect(() => {
        CustomerGroupService.getCustomerGroups()
            .then((res) => {
                setCustomerGroups(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace('type', LABEL.CUSTGRP), error);
                setError(MESSAGE.FEATCHING_ERROR_MSG.replace('type', LABEL.CUSTGRP));
                setLoading(false);
            });
    }, []);

    const deleteCustomerGroups = (id) => {
        CustomerGroupService.deleteCustomerGroup(id)
            .then(() => setCustomerGroups(customerGroups.filter((customerGroup) => customerGroup.customerGroupId !== id)))
            .catch((error) => {
                console.error(MESSAGE.DELETE_ERROR.replace('type', LABEL.CUSTGRP), error);
                setError(MESSAGE.DELETE_ERROR_MSG.replace('type', LABEL.CUSTGRP));
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
                        <EditIcon url={ROUTES.CST_GRP_UPDATE.replace(':customerGroupId', params.row.customerGroupId)} />
                        <DeleteIcon
                            onClick={() => {
                                setSelectedId(params.row.customerGroupId);
                                setDialogOpen(true);
                            }}
                        />
                        <PreviewIcon url={ROUTES.CST_GRP_VIEW.replace(':customerGroupId', params.row.customerGroupId)} />
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

    if (customerGroups.length === 0) {
        return (
            <div className={classes.errorTitle}>
                <Typography variant="h6">{MESSAGE.LIST_EMPTY.replace('type', LABEL.CUSTGRP)}</Typography>
                <AddNewButton url={ROUTES.ROLE_CREATE} />
            </div>
        );
    }

    return (
        <Container className={classes.mainContainer}>
            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Home />
                    <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>Customer Group List</Typography>
                </Breadcrumbs>
            </div>
            <PageTitle title={LABEL.PAGE_TITLE_LIST.replace(':type', LABEL.CUSTGRP)} />
            <div style={{ marginBottom: "10px" }}>
                <AddNewButton url={ROUTES.CST_GRP_CREATE} />
            </div >
            <DataTable rows={customerGroups} columns={columns} getRowId={(row) => row.customerGroupId} />
            <DeleteConfirmDialog open={dialogOpen} onDelete={deleteCustomerGroups} onCancel={() => setDialogOpen(false)} id={selectedId} />
        </Container>
    );
};

export default CustomerGroupList;