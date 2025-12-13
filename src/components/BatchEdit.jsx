import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  Grid
} from '@mui/material';
import { useNotification } from '../contexts/NotificationProvider';
import './BatchEdit.css';

function BatchEdit({ technologies, onUpdateStatus, onUpdateCategory, onDelete }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [action, setAction] = useState('change-status');
  const [status, setStatus] = useState('in-progress');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  // Фильтрация технологий
  const filteredTechnologies = useMemo(() => {
    if (!searchTerm) return technologies;
    
    return technologies.filter(tech =>
      tech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [technologies, searchTerm]);

  // Уникальные категории
  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    technologies.forEach(tech => {
      if (tech.category && tech.category.trim()) {
        categories.add(tech.category);
      }
    });
    return Array.from(categories).sort();
  }, [technologies]);

  const handleSelect = useCallback((id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredTechnologies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTechnologies.map(t => t.id));
    }
  }, [filteredTechnologies, selectedIds.length]);

  const handleApplyAction = useCallback(() => {
    if (selectedIds.length === 0) {
      showNotification('Выберите хотя бы одну технологию', 'warning');
      return;
    }

    let actionData = null;
    
    switch (action) {
      case 'change-status':
        if (!status) {
          showNotification('Выберите новый статус', 'warning');
          return;
        }
        actionData = { type: 'change-status', status };
        break;
        
      case 'change-category':
        if (category === 'new') {
          if (!newCategory.trim()) {
            showNotification('Введите название новой категории', 'warning');
            return;
          }
          actionData = { type: 'change-category', category: newCategory };
        } else if (!category) {
          showNotification('Выберите категорию', 'warning');
          return;
        } else {
          actionData = { type: 'change-category', category };
        }
        break;
        
      case 'delete':
        actionData = { type: 'delete' };
        break;
        
      default:
        return;
    }
    
    setPendingAction(actionData);
    setConfirmOpen(true);
  }, [selectedIds.length, action, status, category, newCategory, showNotification]);

  const confirmAction = useCallback(() => {
    if (!pendingAction) return;
    
    try {
      switch (pendingAction.type) {
        case 'change-status':
          onUpdateStatus(selectedIds, pendingAction.status);
          break;
          
        case 'change-category':
          onUpdateCategory(selectedIds, pendingAction.category);
          break;
          
        case 'delete':
          onDelete(selectedIds);
          break;
      }
      
      setSelectedIds([]);
      setNewCategory('');
      showNotification(
        `Действие выполнено для ${selectedIds.length} технологий`,
        'success'
      );
    } catch (error) {
      showNotification('Ошибка при выполнении действия', 'error');
      console.error('Batch edit error:', error);
    } finally {
      setConfirmOpen(false);
      setPendingAction(null);
    }
  }, [pendingAction, selectedIds, onUpdateStatus, onUpdateCategory, onDelete, showNotification]);

  const handleCancel = useCallback(() => {
    setSelectedIds([]);
    setAction('change-status');
    setStatus('in-progress');
    setCategory('');
    setNewCategory('');
    setSearchTerm('');
  }, []);

  const getStatusLabel = useCallback((status) => {
    switch (status) {
      case 'completed': return '✅ Завершено';
      case 'in-progress': return '🔄 В процессе';
      case 'not-started': return '⏳ Не начато';
      default: return '❓ Неизвестно';
    }
  }, []);

  // Сброс при изменении действия
  useEffect(() => {
    if (action !== 'change-category') {
      setNewCategory('');
    }
  }, [action]);

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        🔄 Массовое редактирование
      </Typography>

      {/* Поиск */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Поиск технологий"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Введите название, описание или категорию..."
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Выбор действия */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Действие</InputLabel>
            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              label="Действие"
            >
              <MenuItem value="change-status">Изменить статус</MenuItem>
              <MenuItem value="change-category">Изменить категорию</MenuItem>
              <MenuItem value="delete">Удалить выбранные</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Параметры действия */}
        <Grid item xs={12} md={8}>
          {action === 'change-status' && (
            <FormControl fullWidth size="small">
              <InputLabel>Новый статус</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Новый статус"
              >
                <MenuItem value="not-started">⏳ Не начато</MenuItem>
                <MenuItem value="in-progress">🔄 В процессе</MenuItem>
                <MenuItem value="completed">✅ Завершено</MenuItem>
              </Select>
            </FormControl>
          )}

          {action === 'change-category' && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Категория</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Категория"
                >
                  <MenuItem value="">-- Выберите категорию --</MenuItem>
                  {uniqueCategories.map((cat, index) => (
                    <MenuItem key={index} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">+ Новая категория</MenuItem>
                </Select>
              </FormControl>

              {category === 'new' && (
                <TextField
                  fullWidth
                  label="Название категории"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  size="small"
                  required
                />
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Управление выбором */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleSelectAll}
          disabled={filteredTechnologies.length === 0}
          size="small"
        >
          {selectedIds.length === filteredTechnologies.length ? 'Снять все' : 'Выбрать все'}
        </Button>
        
        <Chip
          label={`Выбрано: ${selectedIds.length} из ${filteredTechnologies.length}`}
          color="primary"
          variant="outlined"
        />
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button
          variant="outlined"
          onClick={handleCancel}
          size="small"
        >
          Сбросить
        </Button>
        
        <Button
          variant="contained"
          onClick={handleApplyAction}
          disabled={selectedIds.length === 0}
          color={action === 'delete' ? 'error' : 'primary'}
          size="small"
        >
          Применить
        </Button>
      </Box>

      {/* Список технологий */}
      <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        {filteredTechnologies.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchTerm ? 'По вашему запросу ничего не найдено' : 'Нет технологий для отображения'}
            </Typography>
          </Box>
        ) : (
          filteredTechnologies.map(tech => (
            <Box
              key={tech.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: selectedIds.includes(tech.id) ? 'action.selected' : 'transparent',
                '&:hover': { backgroundColor: 'action.hover' },
                transition: 'background-color 0.2s'
              }}
            >
              <Checkbox
                checked={selectedIds.includes(tech.id)}
                onChange={() => handleSelect(tech.id)}
                inputProps={{ 'aria-label': `Выбрать ${tech.title}` }}
                size="small"
              />
              
              <Box sx={{ flexGrow: 1, ml: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                  {tech.title}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={getStatusLabel(tech.status)}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                  
                  {tech.category && (
                    <Chip
                      label={tech.category}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                  
                  {tech.difficulty && (
                    <Chip
                      label={`Сложность: ${tech.difficulty}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Диалог подтверждения */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {pendingAction?.type === 'delete' ? 'Подтверждение удаления' : 'Подтверждение действия'}
        </DialogTitle>
        
        <DialogContent>
          {pendingAction?.type === 'delete' ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Вы уверены, что хотите удалить {selectedIds.length} технологий? 
              Это действие нельзя отменить.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              Вы собираетесь {pendingAction?.type === 'change-status' ? 'изменить статус' : 'изменить категорию'} 
              у {selectedIds.length} технологий.
            </Alert>
          )}
          
          <Typography variant="body2" color="text.secondary">
            Количество выбранных технологий: <strong>{selectedIds.length}</strong>
          </Typography>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            Отмена
          </Button>
          
          <Button 
            onClick={confirmAction} 
            color={pendingAction?.type === 'delete' ? 'error' : 'primary'}
            variant="contained"
            autoFocus
          >
            {pendingAction?.type === 'delete' ? 'Удалить' : 'Подтвердить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default BatchEdit;