import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid2, Breadcrumbs, } from "@mui/material";
//Service
import CustomerService from '../../../services/CustomerService';
//Utils
import { formatDate } from "../../../utils/Dateutils";

import { Loading, } from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField, PageTitle } from "../../../components/PageElements/CommonElements";
import { Home, CustomerList } from "../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../components/PageElements/Buttons";
import { EnabledIcon, LockedIcon } from "../../../components/PageElements/IconButtons";
import { useStyles } from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as LABEL from '../../../utils/const/FieldLabels';
import * as ROUTES from '../../../utils/const/RouteProperty';

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
            <PageTitle title={LABEL.PAGE_TITLE_VIEW.replace(':type', LABEL.CUSTOMER) + customer.firstName} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={4}>
                            <ReadOnlyField label={LABEL.CUSTOMER_ID} value={customer.customerId} />
                        </Grid2>
                        <Grid2 size={8}><ReadOnlyField label={LABEL.CUSTOMER_USERNAME} value={customer.username} /></Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_GROUP} value={customer.customerGroup.name} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_NAME} value={`${customer.firstName} ${customer.lastName}`} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_EMAIL} value={customer.email} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_PHONE} value={customer.phoneNo1} />
                        </Grid2>
                        <Grid2 size={12}>
                            <ReadOnlyField label={LABEL.CUSTOMER_ADDRS} value={customer.address} />
                        </Grid2>
                        <Grid2 size={6}>
                            <EnabledIcon enabled={customer.enabled} />
                        </Grid2>
                        <Grid2 size={6}>
                            <LockedIcon locked={customer.locked} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_CREATED_AT} value={formatDate(customer.createdAt)} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_CREATED_BY} value={`${customer.createdUser.firstName} ${customer.createdUser.lastName} (${customer.createdUser.username})`} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_UPDATED_AT} value={formatDate(customer.updatedAt)} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CUSTOMER_UPDATED_BY} value={`${customer.updatedUser.firstName} ${customer.updatedUser.lastName} (${customer.updatedUser.username})`} />
                        </Grid2>
                        {customer.deleted && (
                            <>
                                <Grid2 size={6}>
                                    <ReadOnlyField label={LABEL.CUSTOMER_DELETED_AT} value={formatDate(customer.deletedAt)} />
                                </Grid2>
                                <Grid2 size={6}>
                                    <ReadOnlyField label={LABEL.CUSTOMER_DELETED_BY} value={`${customer.deletedUser?.firstName} ${customer.deletedUser?.lastName} (${customer.deletedUser?.username})`} />
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

export default ViewCustomer;