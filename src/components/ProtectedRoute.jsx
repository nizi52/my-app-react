import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Проверяем авторизацию (если нужно)
  // const isAuthenticated = localStorage.getItem('token') || localStorage.getItem('user');
  const isAuthenticated = true; // Пока разрешаем доступ всем
  
  if (!isAuthenticated) {
    // Можно добавить логику перенаправления на страницу входа
    // с сохранением текущего URL для возврата после авторизации
    const returnUrl = window.location.pathname + window.location.search;
    localStorage.setItem('returnUrl', returnUrl);
    
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;