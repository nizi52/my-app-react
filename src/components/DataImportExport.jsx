import { useState } from 'react';
import './DataImportExport.css';

function DataImportExport({ technologies = [], setTechnologies }) {
    const [status, setStatus] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const exportToJSON = () => {
        if (technologies.length === 0) {
            setStatus('❌ Нет данных для экспорта');
            setTimeout(() => setStatus(''), 3000);
            return;
        }

        try {
            const dataStr = JSON.stringify(technologies, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus(`✅ Экспортировано ${technologies.length} технологий`);
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('❌ Ошибка при экспорте');
            console.error('Export error:', error);
        }
    };

    const importFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setStatus('❌ Файл должен быть в формате JSON');
            setTimeout(() => setStatus(''), 3000);
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);

                if (!Array.isArray(imported)) {
                    throw new Error('Данные должны быть массивом объектов');
                }

                const validatedTechnologies = imported.map((item, index) => {
                    if (!item || typeof item !== 'object') {
                        throw new Error(`Элемент ${index}: не является объектом`);
                    }

                    if (!item.title || typeof item.title !== 'string') {
                        throw new Error(`Элемент ${index}: поле "title" обязательно`);
                    }

                    if (!item.category || typeof item.category !== 'string') {
                        throw new Error(`Элемент ${index}: поле "category" обязательно`);
                    }

                    return {
                        id: item.id || `imported-${Date.now()}-${index}`,
                        title: item.title.trim(),
                        description: item.description || '',
                        category: item.category,
                        difficulty: item.difficulty || 'beginner',
                        status: item.status || 'planned',
                        deadline: item.deadline || '',
                        hoursNeeded: Math.max(0, Number(item.hoursNeeded) || 0),
                        resources: Array.isArray(item.resources) 
                            ? item.resources
                                  .filter(r => typeof r === 'string')
                                  .map(r => r.trim())
                                  .filter(r => r.length > 0)
                            : [],
                        createdAt: item.createdAt || new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                });

                const uniqueIds = new Set();
                validatedTechnologies.forEach(tech => {
                    if (uniqueIds.has(tech.id)) {
                        console.warn(`Дубликат ID: ${tech.id}`);
                        tech.id = `${tech.id}-${Date.now()}`;
                    }
                    uniqueIds.add(tech.id);
                });

                setTechnologies(validatedTechnologies);
                
                localStorage.setItem('technologies', JSON.stringify(validatedTechnologies));
                
                setStatus(`✅ Импортировано ${validatedTechnologies.length} технологий`);
                setTimeout(() => setStatus(''), 3000);

            } catch (error) {
                let errorMessage = '❌ Ошибка импорта';
                if (error.name === 'SyntaxError') {
                    errorMessage = '❌ Неверный формат JSON файла';
                } else if (error.message.includes('Данные должны быть массивом')) {
                    errorMessage = '❌ Файл должен содержать массив технологий';
                } else {
                    errorMessage = `❌ ${error.message}`;
                }
                
                setStatus(errorMessage);
                console.error('Import error:', error);
                setTimeout(() => setStatus(''), 5000);
            }
        };

        reader.onerror = () => {
            setStatus('❌ Ошибка чтения файла');
            setTimeout(() => setStatus(''), 3000);
        };

        reader.readAsText(file);
        event.target.value = ''; 
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
            const fakeEvent = {
                target: {
                    files: [file]
                }
            };
            importFromJSON(fakeEvent);
        } else {
            setStatus('❌ Можно перетаскивать только JSON файлы');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const saveToLocalStorage = () => {
        try {
            localStorage.setItem('technologies', JSON.stringify(technologies));
            setStatus('💾 Данные сохранены в localStorage');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('❌ Ошибка сохранения (возможно, превышен лимит)');
            console.error('Save error:', error);
        }
    };

    const loadFromLocalStorage = () => {
        try {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setTechnologies(parsed);
                    setStatus('📂 Данные загружены из localStorage');
                } else {
                    setStatus('❌ Неверный формат данных в localStorage');
                }
            } else {
                setStatus('📭 В localStorage нет сохраненных данных');
            }
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('❌ Ошибка загрузки из localStorage');
            console.error('Load error:', error);
        }
    };

    return (
        <div className="data-import-export">
            <h2>Импорт и экспорт данных</h2>
            
            {status && (
                <div className={`status-message ${status.includes('✅') ? 'success' : 'error'}`}>
                    {status}
                </div>
            )}

            <div className="controls-panel">
                <button 
                    onClick={exportToJSON} 
                    disabled={technologies.length === 0}
                    className="control-btn export-btn"
                    aria-label="Экспорт данных в JSON файл"
                >
                    📤 Экспорт в JSON
                </button>
                
                <label className="file-input-label">
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={importFromJSON}
                        aria-label="Импорт данных из JSON файла"
                    />
                    📥 Импорт из JSON
                </label>
                
                <button 
                    onClick={saveToLocalStorage} 
                    disabled={technologies.length === 0}
                    className="control-btn save-btn"
                >
                    💾 Сохранить локально
                </button>
                
                <button 
                    onClick={loadFromLocalStorage}
                    className="control-btn load-btn"
                >
                    📂 Загрузить из памяти
                </button>
            </div>

            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                aria-label="Перетащите JSON файл сюда"
            >
                📁 Перетащите JSON файл сюда
                <div className="drop-hint">или выберите файл выше</div>
            </div>

            <div className="data-info">
                <p>
                    <strong>Текущее состояние:</strong> {technologies.length} технологий
                </p>
                <p className="help-text">
                    Формат файла: массив объектов с полями title, category, status, deadline, resources
                </p>
            </div>

            <details className="structure-example">
                <summary>Пример структуры JSON</summary>
                <pre>{`[
  {
    "title": "React",
    "category": "frontend",
    "status": "in-progress",
    "deadline": "2024-12-31",
    "resources": ["https://react.dev"]
  }
]`}</pre>
            </details>
        </div>
    );
}

export default DataImportExport;