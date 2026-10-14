const DEFAULT_API_URL = 'https://izzac-backend.vercel.app';
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export const API_URL = configuredApiUrl.replace(/\/+$/, '');

export const resolveApiAssetUrl = (path?: string, fallback = '/window.svg') => {
  if (!path) return fallback;
  return path.startsWith('http') ? path : `${API_URL}${path}`;
};

export { DEFAULT_API_URL };
