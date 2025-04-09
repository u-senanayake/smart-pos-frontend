import { Link } from "react-router-dom";
import { useStyles } from "../../style/makeStyle";
import { Button, } from "@mui/material";
import { Add, } from "@mui/icons-material";

const AddNewButton = ({ url, }) => {
    const classes = useStyles();
    return (
        <Button
            component={Link}
            to={url}
            variant="contained"
            color="primary"
            startIcon={<Add />}
            className={classes.addButton}
        >
            Add New
        </Button>
    );
};
export default AddNewButton;