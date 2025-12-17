import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Stack,
  Divider,
  Alert,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationProvider';

function NotificationSystem() {
  const { showNotification } = useNotification();
  const [customMessage, setCustomMessage] = useState('');
  const [customSeverity, setCustomSeverity] = useState('info');
  const [customDuration, setCustomDuration] = useState(4000);

  const predefinedNotifications = [
    {
      message: '✅ Технология успешно добавлена!',
      severity: 'success',
      icon: '🎉'
    },
    {
      message: '❌ Ошибка при сохранении данных',
      severity: 'error',
      icon: '😱'
    },
    {
      message: '⚠️ Осталось изучить 5 технологий',
      severity: 'warning',
      icon: '⏰'
    },
    {
      message: 'ℹ️ Новое обновление доступно',
      severity: 'info',
      icon: '🆕'
    },
    {
      message: '🎯 Вы завершили 10 технологий!',
      severity: 'success',
      icon: '🏆'
    },
    {
      message: '⚡ Все статусы обновлены',
      severity: 'info',
      icon: '⚡'
    }
  ];

  const handleShowCustom = () => {
    if (!customMessage.trim()) {
      showNotification('Введите текст уведомления', 'warning', 3000);
      return;
    }
    showNotification(customMessage, customSeverity, customDuration);
    setCustomMessage('');
  };

  const getSeverityColor = (severity) => {
    const colors = {
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3'
    };
    return colors[severity] || colors.info;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <NotificationsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          🔔 Система уведомлений
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Интерактивная демонстрация всех типов уведомлений
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Быстрые примеры */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ⚡ Быстрые примеры
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Нажмите на кнопку, чтобы увидеть уведомление
              </Typography>
              
              <Stack spacing={2}>
                {predefinedNotifications.map((notif, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    fullWidth
                    onClick={() => showNotification(notif.message, notif.severity, 4000)}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderColor: getSeverityColor(notif.severity),
                      color: getSeverityColor(notif.severity),
                      '&:hover': {
                        borderColor: getSeverityColor(notif.severity),
                        backgroundColor: `${getSeverityColor(notif.severity)}10`
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <span style={{ fontSize: '1.5em' }}>{notif.icon}</span>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {notif.message}
                      </Typography>
                      <Chip 
                        label={notif.severity} 
                        size="small"
                        sx={{ 
                          bgcolor: `${getSeverityColor(notif.severity)}20`,
                          color: getSeverityColor(notif.severity)
                        }}
                      />
                    </Box>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Кастомное уведомление */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🎨 Создать своё уведомление
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Настройте параметры и создайте уникальное уведомление
              </Typography>

              <Stack spacing={3}>
                {/* Текст сообщения */}
                <TextField
                  fullWidth
                  label="Текст уведомления"
                  placeholder="Введите ваше сообщение..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  multiline
                  rows={2}
                />

                {/* Тип уведомления */}
                <FormControl fullWidth>
                  <InputLabel>Тип уведомления</InputLabel>
                  <Select
                    value={customSeverity}
                    onChange={(e) => setCustomSeverity(e.target.value)}
                    label="Тип уведомления"
                  >
                    <MenuItem value="success">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon color="success" />
                        Success (Успех)
                      </Box>
                    </MenuItem>
                    <MenuItem value="error">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ErrorIcon color="error" />
                        Error (Ошибка)
                      </Box>
                    </MenuItem>
                    <MenuItem value="warning">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon color="warning" />
                        Warning (Предупреждение)
                      </Box>
                    </MenuItem>
                    <MenuItem value="info">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon color="info" />
                        Info (Информация)
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Длительность */}
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Длительность показа: {customDuration / 1000} сек
                  </Typography>
                  <Slider
                    value={customDuration}
                    onChange={(e, value) => setCustomDuration(value)}
                    min={1000}
                    max={10000}
                    step={500}
                    marks={[
                      { value: 1000, label: '1с' },
                      { value: 5000, label: '5с' },
                      { value: 10000, label: '10с' }
                    ]}
                  />
                </Box>

                {/* Кнопка показать */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleShowCustom}
                  disabled={!customMessage.trim()}
                >
                  Показать уведомление
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Документация */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📖 Как работают уведомления
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>Success</strong> - Успешные операции
                    </Typography>
                    <Typography variant="body2">
                      • Добавление технологии<br/>
                      • Сохранение изменений<br/>
                      • Импорт данных
                    </Typography>
                  </Alert>

                  <Alert severity="error">
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>Error</strong> - Ошибки
                    </Typography>
                    <Typography variant="body2">
                      • Сбой сохранения<br/>
                      • Ошибка валидации<br/>
                      • Проблемы с сетью
                    </Typography>
                  </Alert>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>Warning</strong> - Предупреждения
                    </Typography>
                    <Typography variant="body2">
                      • Нет данных для операции<br/>
                      • Приближается дедлайн<br/>
                      • Незаполненные поля
                    </Typography>
                  </Alert>

                  <Alert severity="info">
                    <Typography variant="subtitle2" gutterBottom>
                      <strong>Info</strong> - Информация
                    </Typography>
                    <Typography variant="body2">
                      • Случайный выбор технологии<br/>
                      • Обновление статистики<br/>
                      • Общие подсказки
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="text.secondary">
                <strong>💡 Совет:</strong> Уведомления автоматически закрываются через установленное время 
                или при клике на кнопку закрытия (X). Во всём приложении уведомления появляются при 
                каждом важном действии пользователя.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NotificationSystem;