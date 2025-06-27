import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import * as MESSAGE from '../../utils/const/Message';
import * as LABEL from '../../utils/const/FieldLabels';

const DeleteConfirmDialog= ({ open, onDelete, onCancel, id, type }) => {

    const handleConfirm = () => {
        if (onDelete && id) {
            onDelete(id);
        }
        onCancel();
    };

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{LABEL.DELETE_DIALOG_TITLE.replace(':type', type)}</DialogTitle>
            <DialogContent>
                <DialogContentText>{MESSAGE.DELETE_CONFIRM.replace(':type', type)}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    {LABEL.DELETE_DIALOG_BTN_CANCEL}
                </Button>
                <Button onClick={handleConfirm} color="secondary">
                    {LABEL.DELETE_DIALOG_BTN_CONFIRM}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default DeleteConfirmDialog;