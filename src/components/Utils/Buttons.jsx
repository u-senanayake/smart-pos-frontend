import { Button } from "@mui/material";
import { Update, Cancel, Save } from '@mui/icons-material';

export const UpdateButton = ({ onClick, }) => {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onClick}
            startIcon={<Update />}>
            Update </Button>
    );
};

export const CancelButton = ({ onClick, }) => {
    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onClick}
            startIcon={<Cancel />}>
            Cancel
        </Button>
    );
};

export const UpdateSaveButton = ({ onClick, isSaving }) => {
    return (
        <Button
            disabled={isSaving}
            variant="contained"
            color="primary"
            onClick={onClick}
            startIcon={<Update />}>
            {isSaving ? 'Updating...' : 'Update'}
        </Button>
    );
};

export const SaveButton = ({ onClick, isSaving }) => {
    return (
        <Button
            disabled={isSaving}
            variant="contained"
            color="primary"
            onClick={onClick}
            startIcon={<Save />}>
            {isSaving ? 'Saving...' : 'Save'}
        </Button>
    );
};