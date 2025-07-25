import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Breadcrumbs, Container, Grid2, Paper, Typography,} from "@mui/material";
import CustomerGroupService from '../../../services/CustomerGroupService';
import {formatDate} from "../../../utils/Dateutils";

import {Loading,} from "../../../components/PageElements/Loading";
import ErrorMessage from "../../../components/DialogBox/ErrorMessage";
import {PageTitle, ReadOnlyField} from "../../../components/PageElements/CommonElements";
import {CustomerGroupList, Home} from "../../../components/PageElements/BreadcrumbsLinks";
import {CancelButton, EditButton} from "../../../components/PageElements/Buttons";
import {EnabledIcon,} from "../../../components/PageElements/IconButtons";

import {useStyles} from "../../../style/makeStyle";

import * as MESSAGE from '../../../utils/const/Message';
import * as LABEL from './utils/customerGroupLabels';
import * as ROUTES from '../../../utils/const/RouteProperty';

const ViewCustomerGroup = () => {

    const {customerGroupId} = useParams();
    const [customerGroup, setCustomerGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        CustomerGroupService.getCustomerGroupById(customerGroupId)
            .then((res) => {
                setCustomerGroup(res.data);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CUSTOMER_GROUP), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CUSTOMER_GROUP));
            }).finally(() => setLoading(false));
    }, [customerGroupId]);

    const handleCancel = () => navigate(ROUTES.CST_GRP_LIST);
    const handleUpdate = () => {
        navigate(ROUTES.CST_GRP_UPDATE.replace(':customerGroupId', customerGroupId));
    };

    if (loading) {
        return <Loading/>;
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
                <Home/>
                <CustomerGroupList/>
                <Typography sx={{color: 'text.primary'}}>View Customer Group</Typography>
            </Breadcrumbs>
            <PageTitle
                title={LABEL.PAGE_TITLE_VIEW.replace(':type', LABEL.CUSTOMER_GROUP).replace(':name', customerGroup.name)}/>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={4}>
                            <ReadOnlyField label={LABEL.ID} value={customerGroup.customerGroupId}/>
                        </Grid2>
                        <Grid2 size={8}>
                            <ReadOnlyField label={LABEL.NAME} value={customerGroup.name}/>
                        </Grid2>
                        <Grid2 size={12}>
                            <ReadOnlyField label={LABEL.DESC} value={customerGroup.description}/>
                        </Grid2>
                        <Grid2 size={6}>
                            <EnabledIcon enabled={customerGroup.enabled}/>
                        </Grid2>
                        <Grid2 size={6}></Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CREATED_AT}
                                           value={formatDate(customerGroup.createdAt)}/>
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.CREATED_BY}
                                           value={`${customerGroup.createdUser.firstName} ${customerGroup.createdUser.lastName} (${customerGroup.createdUser.username})`}/>
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.UPDATED_AT}
                                           value={formatDate(customerGroup.updatedAt)}/>
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.UPDATED_BY}
                                           value={`${customerGroup.updatedUser.firstName} ${customerGroup.updatedUser.lastName} (${customerGroup.updatedUser.username})`}/>
                        </Grid2>
                        {customerGroup.deleted && (
                            <>
                                <Grid2 size={6}>
                                    <ReadOnlyField label={LABEL.DELETED_AT}
                                                   value={formatDate(customerGroup.deletedAt)}/>
                                </Grid2>
                                <Grid2 size={6}>
                                    <ReadOnlyField label={LABEL.DELETED_BY}
                                                   value={`${customerGroup.deletedUser?.firstName} ${customerGroup.deletedUser?.lastName} (${customerGroup.deletedUser?.username})`}/>
                                </Grid2>
                            </>
                        )}
                    </Grid2>
                    <Box className={classes.formButtonsContainer}>
                        <EditButton onClick={handleUpdate}/>
                        <CancelButton onClick={handleCancel}/>
                    </Box>
                </Paper>
            </Container>
        </Container>
    );
};

export default ViewCustomerGroup;
