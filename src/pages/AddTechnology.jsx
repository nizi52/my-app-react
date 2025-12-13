import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Alert
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationProvider';

function AddTechnology({ onAdd }) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'intermediate',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'devops', label: 'DevOps' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'database', label: 'Database' },
    { value: 'testing', label: 'Testing' },
    { value: 'other', label: 'Другое' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Начальный' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];

  const priorities = [
    { value: 'high', label: 'Высокий' },
    { value: 'medium', label: 'Средний' },
    { value: 'low', label: 'Низкий' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Минимум 2 символа';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }

    const newTechnology = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      priority: formData.priority,
      status: 'not-started',
      notes: ''
    };

    try {
      onAdd(newTechnology);
      showNotification(`Технология "${newTechnology.title}" добавлена`, 'success');
      navigate('/');
    } catch (error) {
      showNotification('Ошибка при добавлении технологии', 'error');
      console.error('Add technology error:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h4">
          Добавить новую технологию
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Название */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Название технологии"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title || 'Например: React, TypeScript, Docker'}
                  required
                  autoFocus
                />
              </Grid>

              {/* Описание */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Описание"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description || 'Опишите, что вы будете изучать'}
                  required
                />
              </Grid>

              {/* Категория */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Категория"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Сложность */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Сложность"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  {difficulties.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Приоритет */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Приоритет"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  {priorities.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Информационное сообщение */}
              <Grid item xs={12}>
                <Alert severity="info">
                  После добавления технологии вы сможете отслеживать её статус изучения и добавлять заметки
                </Alert>
              </Grid>

              {/* Кнопки */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                  >
                    Добавить технологию
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddTechnology;