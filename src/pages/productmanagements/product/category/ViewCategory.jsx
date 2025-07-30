import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Breadcrumbs, Container, Grid2, Paper, Typography} from "@mui/material";
import CategoryService from '../../../../services/CategoryService';
import {formatDate} from "../../../../utils/Dateutils";

import {Loading,} from "../../../../components/PageElements/Loading";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import {NameTitle, ReadOnlyField2, ReadOnlyField3} from "../../../../components/PageElements/CommonElements";
import {CategoryList, Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import {CancelButton, EditButton} from "../../../../components/PageElements/Buttons";
import {EnabledIcon,} from "../../../../components/PageElements/IconButtons";
import {useStyles} from "../../../../style/makeStyle";
import {ImageAvatar} from '../../../../components/image/ImageAvatar';

import * as LABEL from './utils/categoryLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as ROUTES from '../../../../utils/const/RouteProperty';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';

const ViewCategory = () => {
    const {categoryId} = useParams();
    const [category, setCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        CategoryService.getCategoryById(categoryId)
            .then((res) => {
                setCategory(res.data);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CATEGORY), error);
                setErrorMessage(MESSAGE.FEATCHING_ERROR_MSG);
            }).finally(() => setLoading(false));
    }, [categoryId]);

    const handleCancel = () => navigate(ROUTES.CATEGORY_LIST);

    const handleUpdate = () => {
        navigate(ROUTES.CATEGORY_UPDATE.replace(':categoryId', categoryId))
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
                <CategoryList/>
                <Typography sx={{color: 'text.primary'}}>View Category</Typography>
            </Breadcrumbs>
            <Container maxWidth="lg">
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={3}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={12} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}><ImageAvatar type={APP_PROPERTY.CATEGORY_TYPE} typeId={category.categoryId}
                                                imageId={category.image.imageId}/></Grid2>
                                <Grid2 size={12}
                                       sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><NameTitle
                                    value={category.name}/></Grid2>
                            </Grid2>
                        </Grid2>
                        <Grid2 size={9}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={4}><ReadOnlyField2 label={LABEL.ID} value={category.categoryId}/></Grid2>
                                <Grid2 size={4}><ReadOnlyField2 label={LABEL.PREFIX}
                                                                value={category.catPrefix}/></Grid2>
                                <Grid2 size={4} sx={{display: 'flex', alignItems: 'center'}}><EnabledIcon
                                    enabled={category.enabled}/></Grid2>
                                <Grid2 size={12}><ReadOnlyField3 label={LABEL.DESCRIPTION}
                                                                 value={category.description}/></Grid2>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Paper>
                <Paper elevation={4} className={classes.formContainer} sx={{borderRadius: 4}}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CREATED_AT}
                                                        value={formatDate(category.createdAt)}/></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.CREATED_BY}
                                                        value={`${category.createdUser.firstName} ${category.createdUser.lastName} (${category.createdUser.username})`}/></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.UPDATED_AT}
                                                        value={formatDate(category.updatedAt)}/></Grid2>
                        <Grid2 size={6}><ReadOnlyField3 label={LABEL.UPDATED_BY}
                                                        value={`${category.updatedUser.firstName} ${category.updatedUser.lastName} (${category.updatedUser.username})`}/></Grid2>
                        {category.deleted && (
                            <>
                                <Grid2 size={6}><ReadOnlyField3 label={LABEL.DELETED_AT}
                                                                value={formatDate(category.deletedAt)}/></Grid2>
                                <Grid2 size={6}><ReadOnlyField3 label={LABEL.DELETED_BY}
                                                                value={`${category.deletedUser?.firstName} ${category.deletedUser?.lastName} (${category.deletedUser?.username})`}/></Grid2>
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
export default ViewCategory;
