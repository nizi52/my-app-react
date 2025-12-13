import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Schedule,
  Category,
  Stars
} from '@mui/icons-material';

function Statistics({ technologies }) {
  const stats = useMemo(() => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;

    // Статистика по категориям
    const categoryStats = technologies.reduce((acc, tech) => {
      const cat = tech.category || 'Без категории';
      if (!acc[cat]) {
        acc[cat] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
      }
      acc[cat].total++;
      if (tech.status === 'completed') acc[cat].completed++;
      if (tech.status === 'in-progress') acc[cat].inProgress++;
      if (tech.status === 'not-started') acc[cat].notStarted++;
      return acc;
    }, {});

    // Статистика по сложности
    const difficultyStats = technologies.reduce((acc, tech) => {
      const diff = tech.difficulty || 'Не указана';
      if (!acc[diff]) {
        acc[diff] = { total: 0, completed: 0 };
      }
      acc[diff].total++;
      if (tech.status === 'completed') acc[diff].completed++;
      return acc;
    }, {});

    // Статистика по приоритету
    const priorityStats = technologies.reduce((acc, tech) => {
      const priority = tech.priority || 'medium';
      if (!acc[priority]) {
        acc[priority] = { total: 0, completed: 0 };
      }
      acc[priority].total++;
      if (tech.status === 'completed') acc[priority].completed++;
      return acc;
    }, {});

    // Прогресс в процентах
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Последние обновленные технологии
    const recentUpdates = [...technologies]
      .filter(t => t.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    // Технологии с заметками
    const technologiesWithNotes = technologies.filter(t => t.notes && t.notes.length > 0);

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progressPercentage,
      categoryStats,
      difficultyStats,
      priorityStats,
      recentUpdates,
      technologiesWithNotes
    };
  }, [technologies]);

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.main`,
              color: 'white',
              borderRadius: '50%',
              p: 2,
              display: 'flex'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const difficultyLabels = {
    'beginner': 'Начальный',
    'intermediate': 'Средний',
    'advanced': 'Продвинутый'
  };

  const priorityLabels = {
    'high': 'Высокий',
    'medium': 'Средний',
    'low': 'Низкий'
  };

  const priorityColors = {
    'high': 'error',
    'medium': 'warning',
    'low': 'info'
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Статистика
      </Typography>

      {/* Основные метрики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего технологий"
            value={stats.total}
            icon={<Category />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Изучено"
            value={stats.completed}
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="В процессе"
            value={stats.inProgress}
            icon={<Schedule />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Не начато"
            value={stats.notStarted}
            icon={<TrendingUp />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Общий прогресс */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📈 Общий прогресс
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={stats.progressPercentage}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              {stats.progressPercentage}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Изучено {stats.completed} из {stats.total} технологий
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Статистика по категориям */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📂 По категориям
              </Typography>
              <List>
                {Object.entries(stats.categoryStats).map(([category, data], index) => (
                  <Box key={category}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>{category}</Typography>
                            <Chip
                              size="small"
                              label={`${data.completed}/${data.total}`}
                              color={data.completed === data.total ? 'success' : 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <LinearProgress
                            variant="determinate"
                            value={data.total > 0 ? (data.completed / data.total) * 100 : 0}
                            sx={{ mt: 1 }}
                          />
                        }
                      />
                    </ListItem>
                    {index < Object.entries(stats.categoryStats).length - 1 && <Divider />}
                  </Box>
                ))}
                {Object.keys(stats.categoryStats).length === 0 && (
                  <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                    Нет данных по категориям
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Статистика по сложности */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 По сложности
              </Typography>
              <List>
                {Object.entries(stats.difficultyStats).map(([difficulty, data], index) => (
                  <Box key={difficulty}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>{difficultyLabels[difficulty] || difficulty}</Typography>
                            <Chip
                              size="small"
                              label={`${data.completed}/${data.total}`}
                              color={data.completed === data.total ? 'success' : 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <LinearProgress
                            variant="determinate"
                            value={data.total > 0 ? (data.completed / data.total) * 100 : 0}
                            sx={{ mt: 1 }}
                          />
                        }
                      />
                    </ListItem>
                    {index < Object.entries(stats.difficultyStats).length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Статистика по приоритету */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⭐ По приоритету
              </Typography>
              <List>
                {Object.entries(stats.priorityStats).map(([priority, data], index) => (
                  <Box key={priority}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>{priorityLabels[priority] || priority}</Typography>
                            <Chip
                              size="small"
                              label={`${data.completed}/${data.total}`}
                              color={priorityColors[priority] || 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <LinearProgress
                            variant="determinate"
                            value={data.total > 0 ? (data.completed / data.total) * 100 : 0}
                            sx={{ mt: 1 }}
                          />
                        }
                      />
                    </ListItem>
                    {index < Object.entries(stats.priorityStats).length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Последние обновления */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🕐 Последние обновления
              </Typography>
              <List>
                {stats.recentUpdates.map((tech, index) => (
                  <Box key={tech.id}>
                    <ListItem>
                      <ListItemText
                        primary={tech.title}
                        secondary={
                          <>
                            {tech.updatedAt && new Date(tech.updatedAt).toLocaleString('ru-RU')}
                            <Chip
                              size="small"
                              label={tech.status === 'completed' ? '✅ Изучено' : tech.status === 'in-progress' ? '🔄 В процессе' : '⏳ Не начато'}
                              sx={{ ml: 1 }}
                            />
                          </>
                        }
                      />
                    </ListItem>
                    {index < stats.recentUpdates.length - 1 && <Divider />}
                  </Box>
                ))}
                {stats.recentUpdates.length === 0 && (
                  <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                    Нет обновлений
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Дополнительная информация */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📝 Дополнительная информация
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Технологий с заметками: <strong>{stats.technologiesWithNotes.length}</strong>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Средний прогресс: <strong>{stats.progressPercentage}%</strong>
                </Typography>
                <Typography variant="body2">
                  Осталось изучить: <strong>{stats.notStarted + stats.inProgress}</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Statistics;