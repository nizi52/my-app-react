// App.jsx
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, Suspense, lazy, useCallback, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { useNotification } from './contexts/NotificationProvider';

// Ленивая загрузка для оптимизации
const Home = lazy(() => import('./pages/Home'));
const TechnologyList = lazy(() => import('./pages/TechnologyList'));
const TechnologyDetail = lazy(() => import('./pages/TechnologyDetail'));
const AddTechnology = lazy(() => import('./pages/AddTechnology'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));

// Компоненты
const TechnologySearch = lazy(() => import('./components/TechnologySearch'));
const RoadmapImporter = lazy(() => import('./components/RoadmapImporter'));
const ResourceLoader = lazy(() => import('./components/ResourceLoader'));
const DataImportExport = lazy(() => import('./components/DataImportExport'));
const FormWithDeadline = lazy(() => import('./components/FormWithDeadline'));
const BatchEdit = lazy(() => import('./components/BatchEdit'));
const NotificationSystem = lazy(() => import('./components/NotificationSystem'));
const ResponsiveTest = lazy(() => import('./components/ResponsiveTest'));

// Хуки и контексты
import useTechnologiesApi from './hooks/useTechnologiesApi';
import { AppThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationProvider';

function AppContent() {
  const { 
    technologies, 
    loading, 
    error, 
    refetch, 
    addTechnology, 
    updateTechnology,
    removeTechnology,
    updateMultipleTechnologies,
    setTechnologies
  } = useTechnologiesApi();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);
  const { showNotification } = useNotification();

  // Загрузка начальных данных
  useEffect(() => {
    if (!loading && technologies.length === 0) {
      const defaultTechnologies = [
        {
          id: 1,
          title: 'React',
          description: 'Библиотека JavaScript для создания пользовательских интерфейсов',
          status: 'in-progress',
          category: 'frontend',
          notes: 'Изучаю хуки и контекст',
          difficulty: 'intermediate',
          priority: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'TypeScript',
          description: 'Надмножество JavaScript с статической типизацией',
          status: 'not-started',
          category: 'frontend',
          notes: '',
          difficulty: 'intermediate',
          priority: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      if (technologies.length === 0) {
        setTechnologies(defaultTechnologies);
        showNotification('Загружены начальные технологии', 'info');
      }
    }
  }, [loading, technologies.length, setTechnologies, showNotification]);

  const updateTechnologyStatus = useCallback((id, newStatus) => {
    try {
      const tech = technologies.find(t => t.id === id);
      updateTechnology(id, { status: newStatus });
      
      const statusText = {
        'completed': 'завершено изучение',
        'in-progress': 'начато изучение',
        'not-started': 'сброшен статус'
      };
      
      showNotification(
        `${tech?.title || 'Технология'}: ${statusText[newStatus]}`, 
        'success'
      );
    } catch (error) {
      showNotification('Ошибка при обновлении статуса', 'error');
      console.error('Update status error:', error);
    }
  }, [technologies, updateTechnology, showNotification]);

  const updateTechnologyNotes = useCallback((id, newNotes) => {
    try {
      updateTechnology(id, { notes: newNotes });
      // Не показываем уведомление при каждом изменении заметок (может быть назойливо)
    } catch (error) {
      showNotification('Ошибка при сохранении заметок', 'error');
      console.error('Update notes error:', error);
    }
  }, [updateTechnology, showNotification]);

  const markAllAsCompleted = useCallback(() => {
    if (technologies.length === 0) {
      showNotification('Нет технологий для обновления', 'warning');
      return;
    }
    
    try {
      technologies.forEach(tech => {
        updateTechnology(tech.id, { status: 'completed' });
      });
      
      showNotification(
        `Все технологии (${technologies.length}) отмечены как изученные`, 
        'success'
      );
    } catch (error) {
      showNotification('Ошибка при массовом обновлении', 'error');
    }
  }, [technologies, updateTechnology, showNotification]);

  const resetAllStatuses = useCallback(() => {
    if (technologies.length === 0) {
      showNotification('Нет технологий для сброса', 'warning');
      return;
    }
    
    try {
      technologies.forEach(tech => {
        updateTechnology(tech.id, { status: 'not-started' });
      });
      
      showNotification('Статусы всех технологий сброшены', 'info');
    } catch (error) {
      showNotification('Ошибка при сбросе статусов', 'error');
    }
  }, [technologies, updateTechnology, showNotification]);

  const randomizeNext = useCallback(() => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStarted.length === 0) {
      showNotification('Все технологии уже начаты или завершены!', 'warning');
      return;
    }
    
    const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
    updateTechnologyStatus(randomTech.id, 'in-progress');
    showNotification(`🎲 Выбрана технология: ${randomTech.title}`, 'info');
  }, [technologies, updateTechnologyStatus, showNotification]);

  const clearAllData = useCallback(() => {
    if (technologies.length === 0) {
      showNotification('Нет данных для очистки', 'warning');
      return;
    }
    
    if (window.confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.')) {
      setTechnologies([]);
      showNotification('Все данные очищены', 'success');
    }
  }, [technologies.length, setTechnologies, showNotification]);

  const handleImportTechnologies = useCallback((importedTechnologies) => {
    try {
      const addedCount = importedTechnologies.length;
      importedTechnologies.forEach(tech => {
        addTechnology(tech);
      });
      showNotification(`Импортировано ${addedCount} технологий`, 'success');
    } catch (error) {
      showNotification('Ошибка при импорте технологий', 'error');
      console.error('Import error:', error);
    }
  }, [addTechnology, showNotification]);

  const handleSaveDeadline = useCallback((deadlineData) => {
    try {
      if (selectedTech) {
        updateTechnology(selectedTech.id, deadlineData);
        showNotification('Сроки изучения обновлены', 'success');
      } else {
        addTechnology({
          ...deadlineData,
          status: 'not-started',
          notes: ''
        });
        showNotification('Новая технология добавлена', 'success');
      }
      setSelectedTech(null);
    } catch (error) {
      showNotification('Ошибка при сохранении сроков', 'error');
      console.error('Save deadline error:', error);
    }
  }, [selectedTech, updateTechnology, addTechnology, showNotification]);

  const handleBulkStatusUpdate = useCallback((ids, newStatus) => {
    try {
      updateMultipleTechnologies(ids, { status: newStatus });
      showNotification(`Статус обновлен у ${ids.length} технологий`, 'success');
    } catch (error) {
      showNotification('Ошибка при массовом обновлении', 'error');
      console.error('Bulk update error:', error);
    }
  }, [updateMultipleTechnologies, showNotification]);

  const handleBulkCategoryUpdate = useCallback((ids, newCategory) => {
    try {
      updateMultipleTechnologies(ids, { category: newCategory });
      showNotification(`Категория обновлена у ${ids.length} технологий`, 'success');
    } catch (error) {
      showNotification('Ошибка при обновлении категорий', 'error');
      console.error('Bulk category update error:', error);
    }
  }, [updateMultipleTechnologies, showNotification]);

  const handleBulkDelete = useCallback((ids) => {
    try {
      ids.forEach(id => removeTechnology(id));
      showNotification(`Удалено ${ids.length} технологий`, 'success');
    } catch (error) {
      showNotification('Ошибка при удалении технологий', 'error');
      console.error('Bulk delete error:', error);
    }
  }, [removeTechnology, showNotification]);

  const filteredTechnologies = technologies.filter(tech => {
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tech.category && tech.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return searchMatch;
  });

  if (error) {
    return (
      <div className="app-error">
        <h2>Ошибка загрузки приложения</h2>
        <p>{error}</p>
        <button onClick={refetch} className="btn btn-primary">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
            <Routes>
              {/* Главная страница */}
              <Route path="/" element={
                <ProtectedRoute>
                  <>
                    <TechnologySearch 
                      onSearch={setSearchQuery}
                      technologies={technologies}
                    />
                    
                    <Home 
                      technologies={filteredTechnologies}
                      onStatusChange={updateTechnologyStatus}
                      onNotesChange={updateTechnologyNotes}
                      onMarkAllCompleted={markAllAsCompleted}
                      onResetAll={resetAllStatuses}
                      onRandomize={randomizeNext}
                      onClearData={clearAllData}
                      onRefresh={refetch}
                    />
                    
                    <RoadmapImporter 
                      onImport={handleImportTechnologies}
                    />
                  </>
                </ProtectedRoute>
              } />
              
              {/* Список всех технологий */}
              <Route path="/technologies" element={
                <ProtectedRoute>
                  <TechnologyList 
                    technologies={technologies}
                  />
                </ProtectedRoute>
              } />
              
              {/* Детальная страница технологии */}
              <Route path="/technology/:id" element={
                <ProtectedRoute>
                  <TechnologyDetail 
                    technologies={technologies}
                    onStatusChange={updateTechnologyStatus}
                    onNotesChange={updateTechnologyNotes}
                    onDelete={removeTechnology}
                    ResourceLoader={ResourceLoader}
                  />
                </ProtectedRoute>
              } />
              
              {/* Добавление новой технологии */}
              <Route path="/add-technology" element={
                <ProtectedRoute>
                  <AddTechnology onAdd={addTechnology} />
                </ProtectedRoute>
              } />

              {/* Управление сроками */}
              <Route path="/deadlines" element={
                <ProtectedRoute>
                  <div className="page-container">
                    <h2>⏱ Управление сроками изучения</h2>
                    <FormWithDeadline
                      technology={selectedTech}
                      onSave={handleSaveDeadline}
                      onCancel={() => setSelectedTech(null)}
                    />
                    <div className="tech-selection">
                      <h3>Выберите технологию для установки сроков:</h3>
                      <div className="tech-buttons">
                        {technologies.slice(0, 10).map(tech => (
                          <button
                            key={tech.id}
                            className={`tech-btn ${selectedTech?.id === tech.id ? 'selected' : ''}`}
                            onClick={() => setSelectedTech(tech)}
                          >
                            {tech.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* Массовое редактирование */}
              <Route path="/bulk-edit" element={
                <ProtectedRoute>
                  <div className="page-container">
                    <h2>🔀 Массовое редактирование</h2>
                    <BatchEdit
                      technologies={technologies}
                      onUpdateStatus={handleBulkStatusUpdate}
                      onUpdateCategory={handleBulkCategoryUpdate}
                      onDelete={handleBulkDelete}
                    />
                  </div>
                </ProtectedRoute>
              } />

              {/* Импорт/экспорт данных */}
              <Route path="/import-export" element={
                <ProtectedRoute>
                  <div className="page-container">
                    <h2>📁 Импорт и экспорт данных</h2>
                    <DataImportExport
                      technologies={technologies}
                      setTechnologies={setTechnologies}
                    />
                  </div>
                </ProtectedRoute>
              } />

              {/* Система уведомлений */}
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <div className="page-container">
                    <h2>🔔 Система уведомлений</h2>
                    <NotificationSystem />
                  </div>
                </ProtectedRoute>
              } />

              {/* Тестирование адаптивности */}
              <Route path="/responsive-test" element={
                <ProtectedRoute>
                  <div className="page-container">
                    <h2>📱 Тестирование адаптивности</h2>
                    <ResponsiveTest />
                  </div>
                </ProtectedRoute>
              } />

              {/* Статистика */}
              <Route path="/statistics" element={
                <ProtectedRoute>
                  <Statistics technologies={technologies} />
                </ProtectedRoute>
              } />

              {/* Настройки */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Вход в систему */}
              <Route path="/login" element={<Login />} />

              {/* Редирект для несуществующих маршрутов */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AppThemeProvider>
  );
}

export default App;