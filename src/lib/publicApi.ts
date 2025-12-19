// src/lib/publicApi.ts
import axios from 'axios';

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
});

export default publicApi;
