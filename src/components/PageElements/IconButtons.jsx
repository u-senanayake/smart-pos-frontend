import React from "react";
import { Chip, IconButton, Tooltip, } from "@mui/material";
import { Delete, Edit, Preview, CheckCircle, Lock, LockOpen, DeleteOutline, Cancel } from "@mui/icons-material";
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

export const EnabledIcon = ({ enabled }) => {
    return (
        enabled ?
            <Chip icon={<CheckCircle style={{ color: 'green' }} />} label="Active" />
            :
            <Chip icon={<Cancel />} label="Not Active" />

    );
};

export const LockedIcon = ({ locked }) => {
    return (
        locked ?
            <Chip icon={<Lock style={{ color: 'red' }} />} label="Un-Locked" />
            :
            <Chip icon={<LockOpen style={{ color: 'green' }} />} label="Locked" />

    );
};

export const DeletedIcon = ({ deleted }) => {
    return (
        deleted ?
            <Chip icon={<Delete style={{ color: 'red' }} />} label="Deleted" />
            :
            <Chip icon={<DeleteOutline style={{ color: 'green' }} />} label="Deleted" />

    );
};
