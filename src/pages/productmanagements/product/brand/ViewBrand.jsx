import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Breadcrumbs, Container, Grid2, Paper, Typography,} from "@mui/material";
import BrandService from '../../../../services/BrandService';
import {formatDate} from "../../../../utils/Dateutils";

import {Loading,} from "../../../../components/PageElements/Loading";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import {NameTitle, ReadOnlyField2, ReadOnlyField3} from "../../../../components/PageElements/CommonElements";
import {BrandList, Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import {CancelButton, EditButton} from "../../../../components/PageElements/Buttons";
import {EnabledIcon,} from "../../../../components/PageElements/IconButtons";
import {ImageAvatar} from '../../../../components/image/ImageAvatar';

import {useStyles} from "../../../../style/makeStyle";

import * as LABEL from './utils/brandLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as ROUTES from '../../../../utils/const/RouteProperty';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';

const ViewBrand = () => {

    const {brandId} = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        BrandService.getBrandById(brandId)
            .then((res) => {
                setBrand(res.data);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.BRAND), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.BRAND));
            }).finally(() => setLoading(false));
    }, [brandId]);

    const handleCancel = () => navigate(ROUTES.BRAND_LIST);

    const handleUpdate = () => {
        navigate(ROUTES.BRAND_UPDATE.replace(':brandId', brandId));
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
                <BrandList/>
                <Typography sx={{color: 'text.primary'}}>View Brand</Typography>
            </Breadcrumbs>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={3}>
                            <Grid2 size={12}
                                   sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><ImageAvatar
                                type={APP_PROPERTY.BRAND_TYPE} typeId={brand.brandId}
                                imageId={brand.image.imageId}/></Grid2>
                            <Grid2 size={12}
                                   sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><NameTitle
                                value={brand.name}/></Grid2>
                        </Grid2>
                        <Grid2 size={9}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={4}><ReadOnlyField2 label={LABEL.ID} value={brand.brandId}/></Grid2>
                                <Grid2 size={6} sx={{display: 'flex', alignItems: 'center'}}><EnabledIcon
                                    enabled={brand.enabled}/></Grid2>
                                <Grid2 size={12}><ReadOnlyField3 label={LABEL.DESCRIPTION}
                                                                 value={brand.description}/></Grid2>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Paper>
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CREATED_AT}
                                                        value={formatDate(brand.createdAt)}/></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CREATED_BY}
                                                        value={`${brand.createdUser.firstName} ${brand.createdUser.lastName} (${brand.createdUser.username})`}/></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.UPDATED_AT}
                                                        value={formatDate(brand.updatedAt)}/></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.UPDATED_BY}
                                                        value={`${brand.updatedUser.firstName} ${brand.updatedUser.lastName} (${brand.updatedUser.username})`}/></Grid2>
                        {brand.deleted && (
                            <>
                                <Grid2 size={6}>
                                    <ReadOnlyField3 label={LABEL.DELETED_AT} value={formatDate(brand.deletedAt)}/>
                                </Grid2>
                                <Grid2 size={6}>
                                    <ReadOnlyField3 label={LABEL.DELETED_BY}
                                                    value={`${brand.deletedUser?.firstName} ${brand.deletedUser?.lastName} (${brand.deletedUser?.username})`}/>
                                </Grid2>
                            </>
                        )}
                    </Grid2>
                </Paper>
                <Box className={classes.formButtonsContainer}>
                    <EditButton onClick={handleUpdate}/>
                    <CancelButton onClick={handleCancel}/>
                </Box>
            </Container>
        </Container>
    );
};
export default ViewBrand;
