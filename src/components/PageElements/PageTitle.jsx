import { useStyles, } from "../../style/makeStyle";
import { Typography, } from "@mui/material";

const PageTitle = ({ title }) => {

    const classes = useStyles();

    return (
        <Typography variant="h6" className={classes.pageTitle}>{title}</Typography>
    );
};
export default PageTitle;