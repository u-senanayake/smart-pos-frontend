import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

const DeleteConfirmDialog = ({ open, message, onDelete, onCancel, id }) => {

    const handleConfirm = () => {
        if (onDelete && id) {
            onDelete(id);
        }
        onCancel();
    };

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{"Delete"}</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to delete this role?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="secondary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default DeleteConfirmDialog;