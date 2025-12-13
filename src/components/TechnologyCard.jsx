import React, { useState, useCallback } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleClick = useCallback((e) => {
    // Предотвращаем клик, если кликнули по textarea
    if (e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    // Определяем следующий статус
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    // Вызываем колбэк с задержкой для визуальной обратной связи
    setTimeout(() => {
      onStatusChange(id, nextStatus);
      setIsUpdating(false);
    }, 150);
  }, [id, status, onStatusChange, isUpdating]);

  const handleNotesChange = useCallback((e) => {
    onNotesChange(id, e.target.value);
  }, [id, onNotesChange]);

  const toggleNotes = useCallback((e) => {
    e.stopPropagation();
    setIsNotesExpanded(prev => !prev);
  }, []);

  const getStatusInfo = useCallback(() => {
    switch (status) {
      case 'completed':
        return { 
          icon: '✅', 
          text: 'Изучено', 
          color: 'completed',
          nextAction: 'Начать заново'
        };
      case 'in-progress':
        return { 
          icon: '🔄', 
          text: 'В процессе', 
          color: 'in-progress',
          nextAction: 'Завершить изучение'
        };
      case 'not-started':
        return { 
          icon: '⏳', 
          text: 'Не начато', 
          color: 'not-started',
          nextAction: 'Начать изучение'
        };
      default:
        return { 
          icon: '❓', 
          text: 'Неизвестно', 
          color: 'not-started',
          nextAction: 'Изменить статус'
        };
    }
  }, [status]);

  const statusInfo = getStatusInfo();

  return (
    <div 
      className={`technology-card ${statusInfo.color} ${isUpdating ? 'updating' : ''}`}
      title={`Кликните чтобы изменить статус. Следующее действие: ${statusInfo.nextAction}`}
    >
      <div className="card-content">
        <div className="card-main" onClick={handleClick}>
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="status-indicator">
            <span className="status-icon">{isUpdating ? '⏳' : statusInfo.icon}</span>
            <span className="status-text">
              {isUpdating ? 'Обновление...' : statusInfo.text}
            </span>
            <span className="status-hint">Кликните для изменения статуса</span>
          </div>
        </div>

        <div className="notes-section">
          <div className="notes-header" onClick={toggleNotes}>
            <span className="notes-title">
                📝 Заметки 
                {notes && notes.length > 0 && <span className="notes-badge">{notes.length} симв.</span>}
            </span>
            <span className="notes-toggle">
              {isNotesExpanded ? '▲' : '▼'}
            </span>
          </div>
          
          {isNotesExpanded && (
            <div className="notes-content">
              <textarea
                value={notes || ''}
                onChange={handleNotesChange}
                placeholder="Записывайте сюда важные моменты, ссылки, идеи..."
                className="notes-textarea"
                rows="4"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="notes-hint">
                {notes && notes.length > 0
                  ? `✓ Заметка сохранена (${notes.length} символов)` 
                  : '✎ Добавьте заметку для этой технологии'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(TechnologyCard);