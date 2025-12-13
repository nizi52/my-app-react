import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Alert,
  Link,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Google,
  GitHub
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // В реальном приложении здесь был бы запрос к серверу
      // const response = await authApi.login(formData);
      
      // Для демо просто сохраняем токен
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: formData.email.split('@')[0]
      }));
      
      // Перенаправляем на главную или сохраненный URL
      const returnUrl = localStorage.getItem('returnUrl') || '/';
      localStorage.removeItem('returnUrl');
      navigate(returnUrl);
      
    } catch (error) {
      setLoginError('Неверный email или пароль');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // В реальном приложении здесь была бы OAuth авторизация
    alert(`Авторизация через ${provider} в демо-режиме не доступна`);
  };

  const handleGuestLogin = () => {
    // Вход без регистрации
    localStorage.setItem('guest', 'true');
    navigate('/');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 3
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 450,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              🔐 Вход в систему
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Войдите в свой аккаунт для доступа к трекеру технологий
            </Typography>
          </Box>
          
          {loginError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {loginError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              sx={{ mb: 3 }}
              InputProps={{
                placeholder: 'user@example.com'
              }}
            />
            
            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Link 
                href="#" 
                variant="body2" 
                onClick={(e) => {
                  e.preventDefault();
                  alert('Функция восстановления пароля в разработке');
                }}
              >
                Забыли пароль?
              </Link>
            </Box>
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ 
                mb: 3,
                height: 48,
                fontSize: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Нет аккаунта?{' '}
              <Link 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  alert('Функция регистрации в разработке');
                }}
                sx={{ fontWeight: 'bold' }}
              >
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              или войдите с помощью
            </Typography>
          </Divider>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
            >
              Google
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
            >
              GitHub
            </Button>
          </Box>
          
          <Button
            fullWidth
            variant="text"
            onClick={handleGuestLogin}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            Продолжить как гость
          </Button>
        </CardContent>
        
        <Box sx={{ 
          p: 2, 
          textAlign: 'center',
          bgcolor: 'action.hover',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12
        }}>
          <Typography variant="caption" color="text.secondary">
            Используя приложение, вы соглашаетесь с условиями использования
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default Login;