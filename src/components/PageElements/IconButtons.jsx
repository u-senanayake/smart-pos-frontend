import React from "react";
import { IconButton } from "@mui/material";
import { Delete, Edit, Preview } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const DeleteIcon = ({ onClick, }) => {
    return (
        <IconButton onClick={onClick} aria-label="Delete">
            <Delete color="error" />
        </IconButton>
    );
};

export const EditIcon = ({ url, }) => {
    return (
        <IconButton component={Link} to={url} aria-label="Edit">
            <Edit color="primary" />
        </IconButton>
    );
};

export const PreviewIcon = ({ url, ariaLabel = "Preview Role" }) => {
    return (
        <IconButton component={Link} to={url} aria-label={ariaLabel}>
            <Preview color="primary" />
        </IconButton>
    );
};