import { useState } from "react";
import { Paper, Box, Typography } from "@mui/material";

function ImageCreate({ classes, setFile, file }) {

    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <Paper elevation={1} className={classes.formContainer} sx={{ borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </Box>
            {file && (
                <Box mt={2}>
                    <Typography variant="body2">Selected: {file.name}</Typography>
                </Box>
            )}
        </Paper>
    );
}
export default ImageCreate;