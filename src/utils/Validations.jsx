export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password, minLength = 6) => {
  return validateLength(password, minLength, Infinity);
};

export const validateRequired = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};

export const validateLength = (value, minLength, maxLength) => {
  if (typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= minLength && length <= maxLength;
};