import React from "react";
import { Chip, IconButton, Tooltip, } from "@mui/material";
import { Delete, Edit, Preview, CheckCircle, Lock, LockOpen,  DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import FaceIcon from "@mui/icons-material/Face";

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
            <Chip icon={<CheckCircle style={{ color: 'green' }} />} label="Enabled" />
            :
            <Chip icon={<CheckCircle />} label="Enabled" />

    );
};

export const LockedIcon = ({ locked }) => {
    return (
        locked ?
            <Chip icon={<Lock style={{ color: 'red' }} />} label="Enabled" />
            :
            <Chip icon={<LockOpen style={{ color: 'green' }} />} label="Enabled" />

    );
};

export const DeletedIcon = ({ deleted }) => {
    return (
        deleted ?
            <Chip icon={<Delete style={{ color: 'red' }} />} label="Enabled" />
            :
            <Chip icon={<DeleteOutline style={{ color: 'green' }} />} label="Enabled" />

    );
};