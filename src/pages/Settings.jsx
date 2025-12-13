import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useThemeMode } from '../hooks/useThemeMode';
import { useNotification } from '../contexts/NotificationProvider';

function Settings() {
  const { mode, toggleTheme } = useThemeMode();
  const { showNotification } = useNotification();
  
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    language: 'ru',
    itemsPerPage: 10,
    defaultStatus: 'not-started',
    showCompletedTasks: true
  });

  const [userName, setUserName] = useState('');

  // Загрузка настроек при монтировании
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Ошибка загрузки настроек:', err);
      }
    }

    const savedUserName = localStorage.getItem('user');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  // Сохранение настроек
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      showNotification('Настройки успешно сохранены', 'success');
    } catch (err) {
      showNotification('Ошибка сохранения настроек', 'error');
      console.error('Ошибка сохранения:', err);
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleResetSettings = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки?')) {
      const defaultSettings = {
        notifications: true,
        autoSave: true,
        language: 'ru',
        itemsPerPage: 10,
        defaultStatus: 'not-started',
        showCompletedTasks: true
      };
      setSettings(defaultSettings);
      localStorage.removeItem('appSettings');
      showNotification('Настройки сброшены к значениям по умолчанию', 'info');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ ВНИМАНИЕ! Это действие удалит ВСЕ данные приложения и не может быть отменено. Продолжить?')) {
      if (window.confirm('Вы ДЕЙСТВИТЕЛЬНО уверены? Все технологии, заметки и настройки будут удалены навсегда!')) {
        try {
          localStorage.removeItem('technologies');
          localStorage.removeItem('appSettings');
          showNotification('Все данные успешно удалены', 'success');
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } catch (err) {
          showNotification('Ошибка при удалении данных', 'error');
        }
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ⚙️ Настройки
      </Typography>

      {/* Профиль */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            👤 Профиль
          </Typography>
          <TextField
            fullWidth
            label="Имя пользователя"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            margin="normal"
            helperText="Ваше имя для персонализации"
          />
          <Button
            variant="contained"
            onClick={() => {
              localStorage.setItem('user', userName);
              showNotification('Имя пользователя обновлено', 'success');
            }}
            sx={{ mt: 2 }}
          >
            Сохранить имя
          </Button>
        </CardContent>
      </Card>

      {/* Внешний вид */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎨 Внешний вид
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
              />
            }
            label={`Темная тема ${mode === 'dark' ? '(включена)' : '(выключена)'}`}
          />
        </CardContent>
      </Card>

      {/* Уведомления */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔔 Уведомления
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
            }
            label="Показывать уведомления"
          />
        </CardContent>
      </Card>

      {/* Поведение приложения */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚡ Поведение приложения
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
            }
            label="Автоматическое сохранение"
          />

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showCompletedTasks}
                  onChange={(e) => handleSettingChange('showCompletedTasks', e.target.checked)}
                />
              }
              label="Показывать выполненные задачи"
            />
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Статус по умолчанию</InputLabel>
            <Select
              value={settings.defaultStatus}
              onChange={(e) => handleSettingChange('defaultStatus', e.target.value)}
              label="Статус по умолчанию"
            >
              <MenuItem value="not-started">⏳ Не начато</MenuItem>
              <MenuItem value="in-progress">🔄 В процессе</MenuItem>
              <MenuItem value="completed">✅ Завершено</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Элементов на странице</InputLabel>
            <Select
              value={settings.itemsPerPage}
              onChange={(e) => handleSettingChange('itemsPerPage', e.target.value)}
              label="Элементов на странице"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Действия */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💾 Управление данными
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleSaveSettings}
              color="primary"
            >
              Сохранить настройки
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleResetSettings}
              color="secondary"
            >
              Сбросить настройки
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ⚠️ Опасная зона
            </Typography>
            <Typography variant="body2">
              Следующее действие удалит все данные и не может быть отменено
            </Typography>
          </Alert>

          <Button
            variant="contained"
            color="error"
            onClick={handleClearAllData}
            fullWidth
          >
            🗑️ Удалить все данные
          </Button>
        </CardContent>
      </Card>

      {/* Информация */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ℹ️ О приложении
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Версия: 1.0.0
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Трекер технологий - приложение для отслеживания прогресса изучения технологий
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Данные хранятся локально в вашем браузере
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings;