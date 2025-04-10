import { Typography, } from "@mui/material";
const ErrorMessage = ({ message }) => {
    return (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
            <Typography variant="h6" color="error">
                {message}
            </Typography>
        </div>
    );
};
export default ErrorMessage;