import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid2, Breadcrumbs, } from "@mui/material";

//Service
import DistributorService from '../../../../services/DistributorService';
//Utils
import { formatDate } from "../../../../utils/Dateutils";


import { Loading, } from "../../../../components/PageElements/Loading";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import { ReadOnlyField, PageTitle } from "../../../../components/PageElements/CommonElements";
import { Home, DistributorList } from "../../../../components/PageElements/BreadcrumbsLinks";
import { EditButton, CancelButton } from "../../../../components/PageElements/Buttons";
import { EnabledIcon, } from "../../../../components/PageElements/IconButtons";

import { useStyles } from "../../../../style/makeStyle";

import * as MESSAGE from '../../../../utils/const/Message';
import * as LABEL from '../../../../utils/const/FieldLabels';
import * as ROUTES from '../../../../utils/const/RouteProperty';

const ViewDistributor = () => {

    const classes = useStyles();
    const { distributorId } = useParams();
    const [distributor, setDistributor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        DistributorService.getDistributorById(distributorId)
            .then((res) => {
                setDistributor(res.data);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.DISTRIBUTOR), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.DISTRIBUTOR));
            }).finally(() => setLoading(false));
    }, [distributorId]);


    const handleCancel = () => navigate(ROUTES.DISTRIBUTOR_LIST);

    const handleUpdate = () => {
        navigate(ROUTES.DISTRIBUTOR_UPDATE.replace(':distributorId', distributorId));
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
                <DistributorList />
                <Typography sx={{ color: 'text.primary' }}>View Role</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_VIEW.replace(':type', LABEL.DISTRIBUTOR) + distributor.companyName} />
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{ borderRadius: 4 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={4}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_ID} value={distributor.distributorId} />
                        </Grid2>
                        <Grid2 size={8}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_COMPANYNAME} value={distributor.companyName} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_EMAIL} value={distributor.email} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_PHONE1} value={`${distributor.phoneNo1} / ${distributor.phoneNo2} `} />
                        </Grid2>
                        <Grid2 size={12}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_ADDRESS} value={distributor.address} />
                        </Grid2>
                        <Grid2 size={6}>
                            <EnabledIcon enabled={distributor.enabled} />
                        </Grid2>
                        <Grid2 size={6}></Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_CREATED_AT} value={formatDate(distributor.createdAt)} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_CREATED_BY} value={`${distributor.createdUser.firstName} ${distributor.createdUser.lastName} (${distributor.createdUser.username})`} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_UPDATED_AT} value={formatDate(distributor.updatedAt)} />
                        </Grid2>
                        <Grid2 size={6}>
                            <ReadOnlyField label={LABEL.DISTRIBUTOR_UPDATED_BY} value={`${distributor.updatedUser.firstName} ${distributor.updatedUser.lastName} (${distributor.updatedUser.username})`} />
                        </Grid2>
                        {distributor.deleted && (
                            <>
                                <Grid2 size={6}>
                                    <ReadOnlyField label={LABEL.DISTRIBUTOR_DELETED_AT} value={formatDate(distributor.deletedAt)} />
                                </Grid2>
                                <Grid2 size={6}>
                                    <ReadOnlyField label={LABEL.DISTRIBUTOR_DELETED_BY} value={`${distributor.deletedUser?.firstName} ${distributor.deletedUser?.lastName} (${distributor.deletedUser?.username})`} />
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
export default ViewDistributor;
