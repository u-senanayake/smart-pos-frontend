import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Breadcrumbs, Container, Grid2, Paper, Typography, } from "@mui/material";
//Service
import CustomerService from '../../../services/CustomerService';
//Utils
import { formatDate } from "../../../utils/Dateutils";

import { Loading, } from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { PageTitle, ReadOnlyField, ReadOnlyField2, ReadOnlyField3, NameTitle } from "../../../components/PageElements/CommonElements";
import { CustomerList, Home } from "../../../components/PageElements/BreadcrumbsLinks";
import { CancelButton, EditButton } from "../../../components/PageElements/Buttons";
import { EnabledIcon, LockedIcon } from "../../../components/PageElements/IconButtons";
import { useStyles } from "../../../style/makeStyle";
import { ImageAvatar } from '../../../components/image/ImageAvatar';

import * as MESSAGE from '../../../utils/const/Message';
import * as LABEL from './utils/customerLabels';
import * as ROUTES from '../../../utils/const/RouteProperty';
import * as APP_PROPERTY from '../../../utils/const/AppProperty';

const ViewCustomer = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        CustomerService.getCustomerById(customerId)
            .then((res) => {
                setCustomer(res.data);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CUSTOMER), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.CUSTOMER));
            }).finally(() => setLoading(false));
    }, [customerId]);

    const handleCancel = () => navigate(ROUTES.CUSTOMER_LIST);

    const handleUpdate = () => {
        navigate(ROUTES.CUSTOMER_UPDATE.replace(':customerId', customerId));
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
                <CustomerList />
                <Typography sx={{ color: 'text.primary' }}>View Customer</Typography>
            </Breadcrumbs>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={4}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={12}
                                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><ImageAvatar
                                        type={APP_PROPERTY.CUSTOMER_TYPE} typeId={customer.customerId}
                                        imageId={customer.image.imageId} /></Grid2>
                                <Grid2 size={12}
                                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><NameTitle
                                        value={`${customer.firstName} ${customer.lastName}`} /></Grid2>
                            </Grid2>
                        </Grid2>
                        <Grid2 size={8}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={12}><ReadOnlyField2 label={LABEL.CUSTOMER_USERNAME} value={`${customer.username} (${customer.customerId})`} /></Grid2>
                                <Grid2 size={12}><ReadOnlyField2 label={LABEL.CUSTOMER_GROUP} value={customer.customerGroup.name} /></Grid2>
                                <Grid2 size={6}><ReadOnlyField2 label={LABEL.CUSTOMER_EMAIL} value={customer.email} /></Grid2>
                                <Grid2 size={6}><ReadOnlyField2 label={LABEL.CUSTOMER_PHONE} value={customer.phoneNo1} /></Grid2>
                                <Grid2 size={12}><ReadOnlyField2 label={LABEL.CUSTOMER_ADDRS} value={customer.address} /></Grid2>
                                <Grid2 size={6}><EnabledIcon enabled={customer.enabled} /></Grid2>
                                <Grid2 size={6}><LockedIcon locked={customer.locked} /></Grid2>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Paper>
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CUSTOMER_CREATED_AT} value={formatDate(customer.createdAt)} /></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CUSTOMER_CREATED_BY} value={`${customer.createdUser.firstName} ${customer.createdUser.lastName} (${customer.createdUser.username})`} /></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CUSTOMER_UPDATED_AT} value={formatDate(customer.updatedAt)} /></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CUSTOMER_UPDATED_BY} value={`${customer.updatedUser.firstName} ${customer.updatedUser.lastName} (${customer.updatedUser.username})`} /></Grid2>
                        {customer.deleted && (
                            <>
                                <Grid2 size={6}><ReadOnlyField3 label={LABEL.CUSTOMER_DELETED_AT} value={formatDate(customer.deletedAt)} /></Grid2>
                                <Grid2 size={6}><ReadOnlyField3 label={LABEL.CUSTOMER_DELETED_BY} value={`${customer.deletedUser?.firstName} ${customer.deletedUser?.lastName} (${customer.deletedUser?.username})`} /></Grid2>
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

export default ViewCustomer;