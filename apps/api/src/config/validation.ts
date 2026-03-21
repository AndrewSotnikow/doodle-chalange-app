const VALIDATION_CONFIG = {
  message: {
    minLength: 1,
    maxLength: 500,
    limit: 50,
    maxLimit: 1000,
  },
  author: {
    minLength: 1,
    maxLength: 50,
  },
} as const;

export { VALIDATION_CONFIG };
