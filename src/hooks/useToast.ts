import { useState, useCallback } from 'react';
import { ToastMessage } from '../types';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', autoClose = true) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = {
      id,
      message,
      type,
      autoClose
    };

    setToasts(prev => [...prev, newToast]);

    if (autoClose) {
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast
  };
};