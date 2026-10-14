import axios from 'axios';

type ApiErrorPayload = {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
};

const firstString = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return null;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ApiErrorPayload | string>(error)) return fallback;

  const data = error.response?.data;
  if (!data) return fallback;

  if (typeof data === 'string') return data;

  const directMessage = firstString(data.detail) || firstString(data.non_field_errors);
  if (directMessage) return directMessage;

  for (const value of Object.values(data)) {
    const fieldMessage = firstString(value);
    if (fieldMessage) return fieldMessage;
  }

  return fallback;
};
