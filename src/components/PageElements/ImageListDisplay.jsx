
import { Box, IconButton, Avatar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import * as APP_PROPERTY from '../../utils/const/AppProperty';
import * as LABEL from '../../utils/const/FieldLabels';
import * as MESSAGE from '../../utils/const/Message';
import ImageService from '../../services/ImageService';

function ImageListDisplay({ imageType, images, typeId, setSuccessMessage, setErrorMessage, refreshImageList }) {

    const createImageUrl = (image) => {
        if (!image) return ''
        return `${APP_PROPERTY.FILE_SERVER_URL}${imageType}/${typeId}/${image.imageId}`;
    };

    // Handle image removal
    const handleRemoveImage = (index) => {
        const imageToRemove = images[index];
        if (imageToRemove && imageToRemove.imageId && typeId) {
            ImageService.deleteImage(imageToRemove.imageId)
                .then(() => {
                    setSuccessMessage(MESSAGE.DELETE_SUCCESS.replace(':type', LABEL.IMAGE));
                    refreshImageList();
                })
                .catch((error) => {
                    setErrorMessage(MESSAGE.DELETE_ERROR_MSG.replace(':type', LABEL.IMAGE));
                    console.error(MESSAGE.DELETE_ERROR.replace(':type', LABEL.IMAGE), error);
                });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {images.map((img, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={typeof img === 'string' ? img : createImageUrl(img)}
                        variant="square"
                        sx={{ width: 48, height: 48, mr: 1 }}
                    />
                    <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(idx)}
                        aria-label="delete"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
}
export default ImageListDisplay;