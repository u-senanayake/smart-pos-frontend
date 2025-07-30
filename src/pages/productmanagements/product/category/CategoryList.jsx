import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Breadcrumbs, Container, Stack, Typography} from "@mui/material";

import DataTable from "../../../../components/PageElements/DataTable";
import {AddNewButton} from "../../../../components/PageElements/Buttons";
import {PageTitle} from "../../../../components/PageElements/CommonElements";
import {SkeletonLoading} from "../../../../components/PageElements/Loading";
import {DeleteIcon, EditIcon, PreviewIcon} from "../../../../components/PageElements/IconButtons";
import {Home} from "../../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../../components/DialogBox/DeleteConfirmDialog";
import {IconAvatar} from '../../../../components/image/ImageAvatar';
import CategoryService from "../../../../services/CategoryService";
import {renderStatusIcon} from "../../../../utils/utils";

import * as LABEL from './utils/categoryLabel';
import * as MESSAGE from '../../../../utils/const/Message';
import * as ROUTES from '../../../../utils/const/RouteProperty';
import * as APP_PROPERTY from '../../../../utils/const/AppProperty';

//Style
import {useStyles} from "../../../../style/makeStyle";

const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    useNavigate();

    const classes = useStyles();

    useEffect(() => {
        CategoryService.getCategories()
            .then((res) => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(MESSAGE.FEATCHING_ERROR.replace(':type', LABEL.CATEGORY), error);
                setError(MESSAGE.FEATCHING_ERROR_MSG.replace(':type', LABEL.CATEGORY));
                setLoading(false);
            });
    }, []);
    const deleteCategory = (id) => {
        CategoryService.deleteCategory(id)
            .then(() => setCategories(categories.filter((category) => category.categoryId !== id)))
            .catch((error) => {
                console.error(MESSAGE.DELETE_ERROR.replace(':type', LABEL.CATEGORY), error);
                setError(MESSAGE.DELETE_ERROR_MSG.replace(':type', LABEL.CATEGORY));
            });
    };
    const columns = [
        {
            field: 'name',
            headerName: LABEL.TABLE_NAME,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            renderCell: (params) => (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconAvatar
                        type={APP_PROPERTY.CATEGORY_TYPE}
                        typeId={params.row.categoryId}
                        imageId={params.row.image?.imageId}
                    />
                    <span>{params.row.name}</span>
                </Stack>
            ),
        },
        {
            field: 'description',
            headerName: LABEL.TABLE_DESCRIPTION,
            flex: 2,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: 'catPrefix',
            headerName: LABEL.TABLE_CAT_PREFIX,
            flex: 0.7,
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Stack alignItems="center" justifyContent="center" width="100%" height="100%" sx={{minHeight: '100%'}}>
                    {params.row.catPrefix}
                </Stack>
            ),
        },
        {
            field: 'active',
            headerName: LABEL.TABLE_STATUS,
            flex: 0.5,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Stack alignItems="center" justifyContent="center" width="100%" height="100%" sx={{minHeight: '100%'}}>
                    {renderStatusIcon(params.row.enabled)}
                </Stack>
            ),
        },
        {
            field: 'action',
            headerName: LABEL.TABLE_ACTION,
            flex: 1,
            sortable: false,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={2}>
                        <EditIcon url={ROUTES.CATEGORY_UPDATE.replace(':categoryId', params.row.categoryId)}/>
                        <DeleteIcon
                            onClick={() => {
                                setSelectedId(params.row.categoryId);
                                setDialogOpen(true);
                            }}
                        />
                        <PreviewIcon url={ROUTES.CATEGORY_VIEW.replace(':categoryId', params.row.categoryId)}/>
                    </Stack>
                );
            },
        },
    ];

    if (loading) {
        return <SkeletonLoading/>;
    }

    if (error) {
        return (
            <ErrorMessage message={error} actionText="Retry" onAction={() => window.location.reload()}/>
        );
    }

    if (categories.length === 0) {
        return (
            <div className={classes.errorTitle}>
                <Typography variant="h6">{MESSAGE.LIST_EMPTY.replace('type', LABEL.CATEGORY)}</Typography>
                <AddNewButton url={ROUTES.CATEGORY_CREATE}/>
            </div>
        );
    }

    return (
        <Container className={classes.mainContainer}>
            <Breadcrumbs aria-label="breadcrumb">
                <Home/>
                <Typography sx={{color: 'text.primary'}} onClick={(e) => e.stopPropagation()}>Category List</Typography>
            </Breadcrumbs>
            <PageTitle title={LABEL.PAGE_TITLE_LIST.replace(':type', LABEL.CATEGORY)}/>
            <div style={{marginBottom: "10px"}}>
                <AddNewButton url={ROUTES.CATEGORY_CREATE}/>
            </div>
            <DataTable rows={categories} columns={columns} getRowId={(row) => row.categoryId}/>
            <DeleteConfirmDialog open={dialogOpen} onDelete={deleteCategory} onCancel={() => setDialogOpen(false)}
                                 id={selectedId} type={LABEL.CATEGORY}/>
        </Container>
    );
};

export default CategoryList;