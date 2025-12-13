import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ArrowForward
} from '@mui/icons-material';

function TechnologyList({ technologies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  // Получаем уникальные категории
  const categories = useMemo(() => {
    const cats = new Set(technologies.map(t => t.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [technologies]);

  // Фильтрация и сортировка
  const filteredAndSortedTechnologies = useMemo(() => {
    let filtered = technologies.filter(tech => {
      const matchesSearch = searchTerm === '' ||
        tech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || tech.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || tech.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'updated':
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [technologies, searchTerm, filterCategory, filterStatus, sortBy]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { label: '✅ Изучено', color: 'success' };
      case 'in-progress':
        return { label: '🔄 В процессе', color: 'warning' };
      case 'not-started':
        return { label: '⏳ Не начато', color: 'error' };
      default:
        return { label: status, color: 'default' };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Все технологии
        </Typography>
        <Button
          component={Link}
          to="/add-technology"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Добавить технологию
        </Button>
      </Box>

      {/* Фильтры и поиск */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Поиск */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Поиск по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Фильтр по категории */}
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                fullWidth
                select
                label="Категория"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat === 'all' ? 'Все категории' : cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Фильтр по статусу */}
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                fullWidth
                select
                label="Статус"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Все статусы</MenuItem>
                <MenuItem value="not-started">Не начато</MenuItem>
                <MenuItem value="in-progress">В процессе</MenuItem>
                <MenuItem value="completed">Завершено</MenuItem>
              </TextField>
            </Grid>

            {/* Сортировка */}
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                fullWidth
                select
                label="Сортировка"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="title">По названию</MenuItem>
                <MenuItem value="status">По статусу</MenuItem>
                <MenuItem value="category">По категории</MenuItem>
                <MenuItem value="updated">По дате изменения</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Статистика поиска */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Показано {filteredAndSortedTechnologies.length} из {technologies.length} технологий
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Список технологий */}
      {filteredAndSortedTechnologies.length > 0 ? (
        <Grid container spacing={3}>
          {filteredAndSortedTechnologies.map(tech => {
            const statusInfo = getStatusInfo(tech.status);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={tech.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {tech.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      paragraph
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {tech.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={statusInfo.label}
                        color={statusInfo.color}
                        size="small"
                      />
                      {tech.category && (
                        <Chip
                          label={tech.category}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {tech.priority && (
                        <Chip
                          label={`Приоритет: ${tech.priority}`}
                          size="small"
                          variant="outlined"
                          color={
                            tech.priority === 'high' ? 'error' :
                            tech.priority === 'medium' ? 'warning' : 'info'
                          }
                        />
                      )}
                    </Box>

                    <Button
                      component={Link}
                      to={`/technology/${tech.id}`}
                      variant="text"
                      endIcon={<ArrowForward />}
                      fullWidth
                    >
                      Подробнее
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" gutterBottom>
              Технологии не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Попробуйте изменить фильтры поиска'
                : 'Добавьте свою первую технологию'}
            </Typography>
            {(searchTerm || filterCategory !== 'all' || filterStatus !== 'all') && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
              >
                Сбросить фильтры
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default TechnologyList;