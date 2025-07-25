import React from 'react';
import { Box, } from '@mui/material';
const Image = ({ imgSrc }) => {
    if (!imgSrc) return null;
    return <img src={imgSrc} alt="Product" style={{ maxWidth: 200, maxHeight: 200, objectFit: 'contain' }} />;
};

export default Image;
