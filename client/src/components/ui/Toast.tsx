/* eslint-disable react-refresh/only-export-components */

import toast, { DefaultToastOptions } from 'react-hot-toast';

const defaultOptions: DefaultToastOptions = {
  duration: 4000,
  style: {
    background: '#fff',
    color: '#1f2937',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    borderRadius: '0.75rem',
    padding: '1rem',
    minWidth: '300px',
    maxWidth: '450px',
  },
  success: {
    iconTheme: {
      primary: '#0d9488',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#dc2626',
      secondary: '#fff',
    },
  },
  loading: {
    iconTheme: {
      primary: '#0284c7',
      secondary: '#fff',
    },
  },
};

export function showToast(message: string, type: 'success' | 'error' | 'loading' | 'info' = 'info') {
  switch (type) {
    case 'success':
      return toast.success(message, defaultOptions);
    case 'error':
      return toast.error(message, defaultOptions);
    case 'loading':
      return toast.loading(message, defaultOptions);
    default:
      return toast(message, defaultOptions);
  }
}

export function dismissToast(id: string) {
  toast.dismiss(id);
}

export { Toaster } from 'react-hot-toast';