export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // Example: Password must be at least 6 characters long
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};