import React, { useState, useEffect, } from "react";
import { useNavigate, } from "react-router-dom";
import { Breadcrumbs, Container, Typography, Stack, } from "@mui/material";

import DataTable from "../../../../components/PageElements/DataTable";
import { AddNewButton } from "../../../../components/PageElements/Buttons";
import { PageTitle } from "../../../../components/PageElements/CommonElements";
import { SkeletonLoading } from "../../../../components/PageElements/Loading";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../../components/PageElements/IconButtons";
import { Home } from "../../../../components/PageElements/BreadcrumbsLinks";
import ErrorMessage from "../../../../components/DialogBox/ErrorMessage";
import DeleteConfirmDialog from "../../../../components/DialogBox/DeleteConfirmDialog";

//Service
import DistributorService from "../../../../services/DistributorService";
//Utils
import { renderStatusIcon } from "../../../../utils/utils";

import * as LABEL from '../../../../utils/const/FieldLabels';
import * as MESSAGE from '../../../../utils/const/Message';
import * as ROUTES from '../../../../utils/const/RouteProperty';

//Style
import { useStyles } from "../../../../style/makeStyle";

const DistributorList = () => {

  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    DistributorService.getDistributors()
      .then((res) => {
        setDistributors(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(MESSAGE.FEATCHING_ERROR.replace('type', LABEL.DISTRIBUTOR), error);
        setError(MESSAGE.FEATCHING_ERROR_MSG.replace('type', LABEL.DISTRIBUTOR));
        setLoading(false);
      });
  }, []);

  const deleteDistributor = (id) => {
    DistributorService.deleteDistributor(id)
      .then(() => setDistributors(distributors.filter((distributor) => distributor.distributorId !== id)))
      .catch((error) => {
        console.error(MESSAGE.DELETE_ERROR.replace('type', LABEL.DISTRIBUTOR), error);
        setError(MESSAGE.DELETE_ERROR_MSG.replace('type', LABEL.DISTRIBUTOR));
      });
  };

  function handleClick(event) {
    navigate(event.target.href);
  }
  const columns = [
    {
      field: 'companyName',
      headerName: LABEL.TABLE_COM_NAME,
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'email',
      headerName: LABEL.TABLE_EMAIL,
      flex: 1.2,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'phoneNo1',
      headerName: LABEL.TABLE_PHONE,
      flex: 0.8,
      filterable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'active',
      headerName: LABEL.TABLE_STATUS,
      flex: 0.8,
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
            <EditIcon url={ROUTES.DISTRIBUTOR_UPDATE.replace(':distributorId', params.row.distributorId)} />
            <DeleteIcon
              onClick={() => {
                setSelectedId(params.row.distributorId);
                setDialogOpen(true);
              }}
            />
            <PreviewIcon url={ROUTES.DISTRIBUTOR_VIEW.replace(':distributorId', params.row.distributorId)} />
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

  if (distributors.length === 0) {
    return (
      <div className={classes.errorTitle}>
        <Typography variant="h6">{MESSAGE.LIST_EMPTY.replace('type', LABEL.DISTRIBUTOR)}</Typography>
        <AddNewButton url={ROUTES.DISTRIBUTOR_CREATE} />
      </div>
    );
  };

  return (
    <Container className={classes.mainContainer}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <Home />
          <Typography sx={{ color: 'text.primary' }} onClick={(e) => e.stopPropagation()}>Distributor List</Typography>
        </Breadcrumbs>
      </div>
      <PageTitle title={LABEL.PAGE_TITLE_LIST.replace(':type', LABEL.DISTRIBUTOR)} />
      <div style={{ marginBottom: "10px" }}>
        <AddNewButton url={ROUTES.DISTRIBUTOR_CREATE} />
      </div >
      <DataTable rows={distributors} columns={columns} getRowId={(row) => row.distributorId} />
      <DeleteConfirmDialog open={dialogOpen} onDelete={deleteDistributor} onCancel={() => setDialogOpen(false)} id={selectedId} />
    </Container>
  );
};

export default DistributorList;