import React, { createContext, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotification as useNotificationHook } from '../hooks/useNotification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notification = useNotificationHook();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
      <Snackbar
        open={notification.notification.open}
        autoHideDuration={notification.notification.duration}
        onClose={notification.hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={notification.hideNotification}
          severity={notification.notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Экспортируем хук для использования в компонентах
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};