import axios from 'axios';

const isServer = typeof window === 'undefined';

export const apiClient = axios.create({
  // Automatically use an absolute URL during Server-Side Rendering (SSR),
  // and a relative URL when running in the browser.
  baseURL: isServer ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' : '',
  headers: {
    'Content-Type': 'application/json',
  },
});