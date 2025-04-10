import React from "react";
import { IconButton, Tooltip, } from "@mui/material";
import { Delete, Edit, Preview, } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const DeleteIcon = ({ onClick, }) => {
    return (
        <Tooltip title="Delete">
            <IconButton onClick={onClick} aria-label="Delete">
                <Delete color="error" />
            </IconButton>
        </Tooltip>
    );
};

export const EditIcon = ({ url, }) => {
    return (
        <Tooltip title="Edit">
            <IconButton component={Link} to={url} aria-label="Edit">
                <Edit color="primary" />
            </IconButton>
        </Tooltip>
    );
};

export const PreviewIcon = ({ url, ariaLabel = "Preview Role" }) => {
    return (
        <Tooltip title="View">
            <IconButton component={Link} to={url} aria-label={ariaLabel}>
                <Preview color="primary" />
            </IconButton>
        </Tooltip>
    );
};