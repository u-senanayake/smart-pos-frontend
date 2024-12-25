import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Lock from '@mui/icons-material/Lock';
import LockOpen from '@mui/icons-material/LockOpen';
import Delete from '@mui/icons-material/Delete';
import DeleteOutline from '@mui/icons-material/DeleteOutline';


export const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  export const renderStatusIcon = (enabled) => {
    return enabled ? (
      <CheckCircleIcon style={{ color: 'green' }} />
    ) : (
      <CancelIcon style={{ color: 'red' }} />
    );
  };

  export const renderLockIcon = (locked) => {
    return locked ? (
      <Lock style={{ color: 'red' }} />
    ) : (
      <LockOpen style={{ color: 'green' }} />
    );
  };

  export const renderDeletedIcon = (deleted) => {
    return deleted ? (
      <Delete style={{ color: 'red' }} />
    ) : (
      <DeleteOutline style={{ color: 'green' }} />
    );
  };

  export const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };