import React, { useState } from "react";
import { Paper, Box, Typography } from "@mui/material";

import * as LABEL from '../../utils/const/FieldLabels';
import * as MESSAGE from '../../utils/const/Message';
import ImageService from '../../services/ImageService';

function ImageUpload({ classes, imageType, typeId, setSuccessMessage, setErrorMessage , refreshImageList}) {

    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Add image upload handler
    const handleAddImage = async () => {
        if (!file || !typeId) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        ImageService.uploadImage(formData, imageType, typeId)
            .then(() => {
                setSuccessMessage(MESSAGE.UPDATE_SUCCESS.replace(':type', LABEL.PRODUCT));
                refreshImageList();
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data);
                } else {
                    setErrorMessage(MESSAGE.UPDATE_ERROR_MSG.replace(':type', LABEL.PRODUCT));
                }
                console.error(MESSAGE.UPDATE_ERROR.replace(':type', LABEL.PRODUCT), error.response);
            })
            .finally(() => {
                setIsUploading(false);
                setFile(null);
            });
    };

    return (
        <Paper elevation={1} className={classes.formContainer} sx={{ borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!file || isUploading}
                    style={{ height: 36 }}
                >
                    {isUploading ? "Uploading..." : "Add"}
                </button>
            </Box>
            {file && (
                <Box mt={2}>
                    <Typography variant="body2">Selected: {file.name}</Typography>
                </Box>
            )}
        </Paper>
    );
}

export default ImageUpload;
