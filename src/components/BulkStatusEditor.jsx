// src/components/BulkStatusEditor.jsx
import { useState, useEffect } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onUpdateStatus }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [newStatus, setNewStatus] = useState('planned');
    const [selectAll, setSelectAll] = useState(false);

    // Сброс выбора при изменении списка технологий
    useEffect(() => {
        setSelectedIds([]);
        setSelectAll(false);
    }, [technologies]);

    // Обработка выбора/снятия одной технологии
    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    // Обработка "Выбрать все"
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(technologies.map(t => t.id));
        }
        setSelectAll(!selectAll);
    };

    // Применение нового статуса к выбранным
    const handleApplyStatus = () => {
        if (selectedIds.length === 0) {
            alert('Выберите хотя бы одну технологию');
            return;
        }
        if (window.confirm(`Изменить статус у ${selectedIds.length} технологий?`)) {
            onUpdateStatus(selectedIds, newStatus);
            setSelectedIds([]);
            setSelectAll(false);
        }
    };

    return (
        <div className="bulk-editor" role="region" aria-labelledby="bulk-editor-title">
            <h2 id="bulk-editor-title">Массовое редактирование статусов</h2>

            {/* Управляющие элементы */}
            <div className="bulk-controls">
                <div className="status-selector">
                    <label htmlFor="status-select">Новый статус:</label>
                    <select
                        id="status-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        aria-describedby="status-help"
                    >
                        <option value="planned">Запланировано</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Завершено</option>
                        <option value="on-hold">Отложено</option>
                    </select>
                    <small id="status-help" className="help-text">
                        Будет применён ко всем выбранным технологиям
                    </small>
                </div>

                <div className="action-buttons">
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        aria-pressed={selectAll}
                        className="btn-select-all"
                    >
                        {selectAll ? 'Снять все' : 'Выбрать все'}
                    </button>
                    <button
                        type="button"
                        onClick={handleApplyStatus}
                        disabled={selectedIds.length === 0}
                        className="btn-apply"
                        aria-describedby="apply-help"
                    >
                        Применить к выбранным ({selectedIds.length})
                    </button>
                    <span id="apply-help" className="sr-only">
                        Нажмите, чтобы изменить статус выбранных технологий
                    </span>
                </div>
            </div>

            {/* Список технологий с чекбоксами */}
            <div className="technologies-checklist" role="list">
                {technologies.length === 0 ? (
                    <p className="empty-list">Нет технологий для редактирования</p>
                ) : (
                    technologies.map(tech => (
                        <div 
                            key={tech.id} 
                            className="tech-item"
                            role="listitem"
                        >
                            <input
                                type="checkbox"
                                id={`tech-${tech.id}`}
                                checked={selectedIds.includes(tech.id)}
                                onChange={() => handleSelect(tech.id)}
                                aria-labelledby={`label-${tech.id}`}
                            />
                            <label 
                                htmlFor={`tech-${tech.id}`} 
                                id={`label-${tech.id}`}
                                className="tech-label"
                            >
                                <span className="tech-title">{tech.title}</span>
                                <span 
                                    className={`status-badge status-${tech.status}`}
                                    aria-label={`Текущий статус: ${tech.status}`}
                                >
                                    {tech.status === 'planned' && '🟢 Запланировано'}
                                    {tech.status === 'in-progress' && '🟡 В процессе'}
                                    {tech.status === 'completed' && '🔵 Завершено'}
                                    {tech.status === 'on-hold' && '⚫ Отложено'}
                                </span>
                            </label>
                        </div>
                    ))
                )}
            </div>

            {/* Информация для скринридера */}
            <div 
                role="status" 
                aria-live="polite" 
                aria-atomic="true" 
                className="sr-only"
            >
                {selectedIds.length > 0 
                    ? `Выбрано ${selectedIds.length} технологий` 
                    : 'Технологии не выбраны'
                }
            </div>
        </div>
    );
}

export default BulkStatusEditor;