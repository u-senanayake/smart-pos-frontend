import { Update as UpdateIcon, Save as SaveIcon, Edit as EditIcon, ArrowBackIosNew as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import Fab from '@mui/material/Fab';
import { Link } from "react-router-dom";
export const EditButton = ({ onClick, }) => {
    return (
        <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            onClick={onClick}>
            <EditIcon sx={{ mr: 1 }} /> Edit
        </Fab>
    );
};

export const CancelButton = ({ onClick, }) => {
    return (
        <Fab
            variant="extended"
            size="medium"
            color="secondary"
            onClick={onClick}>
            <ArrowBackIcon sx={{ mr: 1 }} />
            Cancel
        </Fab>
    );
};

export const UpdateButton = ({ onClick, isSaving }) => {
    return (
        <Fab
            disabled={isSaving}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            onClick={onClick}>
            <UpdateIcon sx={{ mr: 1 }} /> {isSaving ? 'Updating...' : 'Update'}
        </Fab>
    );
};

export const SaveButton = ({ onClick, isSaving }) => {
    return (
        <Fab
            disabled={isSaving}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            onClick={onClick}>
            <SaveIcon sx={{ mr: 1 }} />  {isSaving ? 'Saving...' : 'Save'}
        </Fab>
    );
};

export const AddNewButton = ({ url, }) => {
    return (
        <Fab
            component={Link}
            to={url}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add">
            <AddIcon sx={{ mr: 1 }} />  Add New
        </Fab>
    );
};