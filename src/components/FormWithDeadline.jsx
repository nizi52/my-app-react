// src/components/FormWithDeadline.jsx
import { useState, useEffect } from 'react';
import './FormWithDeadline.css';

function FormWithDeadline({ technology, onSave, onCancel }) {
    // Начальные значения с проверкой на undefined
    const [formData, setFormData] = useState({
        title: technology?.title || '',
        deadline: technology?.deadline || '',
        hoursNeeded: technology?.hoursNeeded || 0,
        priority: technology?.priority || 'medium'
    });

    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        // Валидация названия
        if (!formData.title.trim()) {
            newErrors.title = 'Название обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Минимум 2 символа';
        }

        // Валидация дедлайна (если указан)
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }

        // Валидация часов
        if (formData.hoursNeeded < 0) {
            newErrors.hoursNeeded = 'Часы не могут быть отрицательными';
        } else if (formData.hoursNeeded > 1000) {
            newErrors.hoursNeeded = 'Максимум 1000 часов';
        }

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    };

    // Запуск валидации при изменении данных
    useEffect(() => {
        validateForm();
    }, [formData]);

    // Обработчик изменения полей
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    // Обработчик отправки
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid && onSave) {
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="deadline-form" noValidate>
            <h2>Установка сроков изучения</h2>

            {/* Название технологии */}
            <div className="form-group">
                <label htmlFor="title" className="required">
                    Название технологии *
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className={errors.title ? 'error' : ''}
                    placeholder="Например: React, TypeScript, Docker"
                    aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                    <span id="title-error" className="error-message" role="alert">
                        {errors.title}
                    </span>
                )}
            </div>

            {/* Дедлайн */}
            <div className="form-group">
                <label htmlFor="deadline">Дедлайн (необязательно)</label>
                <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={errors.deadline ? 'error' : ''}
                    aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                />
                {errors.deadline && (
                    <span id="deadline-error" className="error-message" role="alert">
                        {errors.deadline}
                    </span>
                )}
            </div>

            {/* Часы на изучение */}
            <div className="form-group">
                <label htmlFor="hoursNeeded">Часов на изучение</label>
                <input
                    id="hoursNeeded"
                    name="hoursNeeded"
                    type="number"
                    min="0"
                    max="1000"
                    step="1"
                    value={formData.hoursNeeded}
                    onChange={handleChange}
                    className={errors.hoursNeeded ? 'error' : ''}
                    aria-describedby={errors.hoursNeeded ? 'hours-error' : undefined}
                />
                {errors.hoursNeeded && (
                    <span id="hours-error" className="error-message" role="alert">
                        {errors.hoursNeeded}
                    </span>
                )}
            </div>

            {/* Приоритет */}
            <div className="form-group">
                <label htmlFor="priority">Приоритет изучения</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    aria-describedby="priority-help"
                >
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                </select>
                <small id="priority-help" className="help-text">
                    Определяет порядок изучения в вашем плане
                </small>
            </div>

            {/* Кнопки действий */}
            <div className="form-actions">
                <button
                    type="submit"
                    disabled={!isValid}
                    className="btn-primary"
                >
                    Сохранить сроки
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default FormWithDeadline;