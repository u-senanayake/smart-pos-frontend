import { TextField, } from "@mui/material";
import { useStyles } from "../../style/makeStyle";

const ReadOnlyField = ({ label, value }) => {

    const classes = useStyles();
    return (
        <TextField
            label={label}
            value={value || "N/A"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            variant="outlined"
            margin="normal"
            className={classes.readOnlyField}
            size="small"
        />
    );
};
export default ReadOnlyField;