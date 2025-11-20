import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomize, onClearData }) {
  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      <div className="actions-buttons">
        <button 
          className="action-btn completed-btn"
          onClick={onMarkAllCompleted}
          title="Отметить все технологии как изученные"
        >
          ✅ Отметить все как выполненные
        </button>
        
        <button 
          className="action-btn reset-btn"
          onClick={onResetAll}
          title="Сбросить статусы всех технологий"
        >
          🔄 Сбросить все статусы
        </button>
        
        <button 
          className="action-btn random-btn"
          onClick={onRandomize}
          title="Случайно выбрать следующую технологию для изучения"
        >
          🎲 Случайный выбор следующей технологии
        </button>
        
        <button 
          className="action-btn clear-btn"
          onClick={onClearData}
          title="Очистить все данные и заметки"
        >
          🗑️ Очистить все данные
        </button>
      </div>
    </div>
  );
}

export default QuickActions;