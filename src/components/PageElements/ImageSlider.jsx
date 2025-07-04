import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProductUpdateImage from './Image';

const ImageSlider = ({ imageUrls }) => {
    const [currentImage, setCurrentImage] = useState(0);

    if (!imageUrls || imageUrls.length === 0) return null;

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImage((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    };

    return (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Box
                sx={{
                    width: 200,
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: '#fafafa'
                }}
            >
                <ProductUpdateImage imgSrc={imageUrls[currentImage]} />
            </Box>
            <Box mt={1} display="flex" alignItems="center" gap={2}>
                <button type="button" onClick={handlePrevImage} disabled={imageUrls.length <= 1}>
                    Prev
                </button>
                <Typography variant="caption">
                    {currentImage + 1} / {imageUrls.length}
                </Typography>
                <button type="button" onClick={handleNextImage} disabled={imageUrls.length <= 1}>
                    Next
                </button>
            </Box>
        </Box>
    );
};

export default ImageSlider;
