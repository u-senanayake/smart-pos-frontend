export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password, minLength = 6) => {
  return validateLength(password, minLength, Infinity);
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0;
  }
  return false;
};

export const validateLength = (value, minLength, maxLength) => {
  if (typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= minLength && length <= maxLength;
};

export const validateExactLength = (value, exactLength) => {
  if (typeof value !== 'string') return false;
  return value.trim().length === exactLength;
};

export const validateNumberField = (number) => {
  return typeof number === 'number' && number !== 0;
};