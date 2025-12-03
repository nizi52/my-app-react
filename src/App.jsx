import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import TechnologySearch from './components/TechnologySearch';
import RoadmapImporter from './components/RoadmapImporter';
import ResourceLoader from './components/ResourceLoader';
import useTechnologiesApi from './hooks/useTechnologiesApi';
import DataImportExport from './components/DataImportExport';
import FormWithDeadline from './components/FormWithDeadline';
import BulkStatusEditor from './components/BulkStatusEditor';

function App() {
  const { 
    technologies, 
    loading, 
    error, 
    refetch, 
    addTechnology, 
    updateTechnology,
    deleteTechnology
  } = useTechnologiesApi();

  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для выбранной технологии (для формы сроков)
  const [selectedTech, setSelectedTech] = useState(null);

  // Обновление статуса (циклически)
  const updateTechnologyStatus = (id) => {
    const tech = technologies.find(t => t.id === id);
    if (tech) {
      const statusOrder = ['not-started', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(tech.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      
      updateTechnology(id, { status: statusOrder[nextIndex] });
    }
  };

  const updateTechnologyNotes = (id, newNotes) => {
    updateTechnology(id, { notes: newNotes });
  };

  const markAllAsCompleted = () => {
    technologies.forEach(tech => {
      updateTechnology(tech.id, { status: 'completed' });
    });
  };

  const resetAllStatuses = () => {
    technologies.forEach(tech => {
      updateTechnology(tech.id, { status: 'not-started' });
    });
  };

  const randomizeNext = () => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      updateTechnologyStatus(randomTech.id);
    } else {
      alert('Все технологии уже начаты или завершены!');
    }
  };

  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('techTrackerData');
      refetch();
    }
  };

  const handleImportTechnologies = (importedTechnologies) => {
    importedTechnologies.forEach(tech => {
      addTechnology(tech);
    });
  };

  // ========== ОБРАБОТЧИКИ ДЛЯ ПЗ 25 ==========
  // 1. Сохранение сроков из FormWithDeadline
  const handleSaveDeadline = (deadlineData) => {
    if (selectedTech) {
      updateTechnology(selectedTech.id, deadlineData);
    } else {
      // Если нет выбранной, создаём новую технологию
      addTechnology({
        ...deadlineData,
        status: 'not-started',
        notes: ''
      });
    }
    setSelectedTech(null);
  };

  // 2. Массовое обновление статусов из BulkStatusEditor
  const handleBulkStatusUpdate = (ids, newStatus) => {
    ids.forEach(id => {
      updateTechnology(id, { status: newStatus });
    });
  };

  // Отфильтрованные технологии для поиска
  const filteredTechnologies = technologies.filter(tech => {
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tech.category && tech.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return searchMatch;
  });

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Загрузка технологий...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navigation />
        
        {error && (
          <div className="app-error">
            <p>Ошибка: {error}</p>
            <button onClick={refetch} className="retry-btn">
              Попробовать снова
            </button>
          </div>
        )}

        <TechnologySearch 
          onSearch={setSearchQuery}
          technologies={technologies}
        />
        
        <Routes>
          <Route path="/" element={
            <>
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
          } />
          
          <Route path="/technologies" element={
            <TechnologyList 
              technologies={technologies}
              searchQuery={searchQuery}
            />
          } />
          
          <Route path="/technology/:id" element={
            <TechnologyDetail 
              technologies={technologies}
              onStatusChange={updateTechnologyStatus}
              onNotesChange={updateTechnologyNotes}
              onDelete={deleteTechnology}
              ResourceLoader={ResourceLoader}
            />
          } />
          
          <Route path="/add-technology" element={
            <AddTechnology onAdd={addTechnology} />
          } />

          {/* ========== МАРШРУТЫ ДЛЯ ПЗ 25 ========== */}
          <Route path="/deadlines" element={
            <div className="pz25-section">
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
          } />

          <Route path="/bulk-edit" element={
            <div className="pz25-section">
              <h2>🔀 Массовое редактирование статусов</h2>
              <BulkStatusEditor
                technologies={technologies}
                onUpdateStatus={handleBulkStatusUpdate}
              />
            </div>
          } />

          <Route path="/import-export" element={
            <div className="pz25-section">
              <h2>📁 Импорт и экспорт данных</h2>
              <DataImportExport
                technologies={technologies}
                setTechnologies={() => {}} // Передаём пустую функцию, если не используется
              />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;