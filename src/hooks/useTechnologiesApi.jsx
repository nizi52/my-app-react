// src/hooks/useTechnologiesApi.jsx
import { useState, useEffect, useCallback } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка из localStorage при старте
  const loadFromStorage = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const saved = localStorage.getItem('technologies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTechnologies(parsed);
        } else {
          throw new Error('Неверный формат данных');
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки из localStorage:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Сохранение в localStorage при любом изменении
  useEffect(() => {
    if (!loading && technologies.length >= 0) {
      try {
        localStorage.setItem('technologies', JSON.stringify(technologies));
      } catch (err) {
        console.error('Ошибка сохранения в localStorage:', err);
        setError('Не удалось сохранить данные');
      }
    }
  }, [technologies, loading]);

  // Обновление технологии
  const updateTechnology = useCallback((id, updates) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === id 
          ? { ...tech, ...updates, updatedAt: new Date().toISOString() } 
          : tech
      )
    );
  }, []);

  // Добавление технологии
  const addTechnology = useCallback((techData) => {
    const newTech = {
      id: Date.now(),
      status: 'not-started',
      notes: '',
      category: 'uncategorized',
      difficulty: 'intermediate',
      priority: 'medium',
      ...techData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTechnologies(prev => [...prev, newTech]);
    return newTech;
  }, []);

  // Удаление технологии
  const removeTechnology = useCallback((id) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== id));
  }, []);

  // Массовое обновление технологий
  const updateMultipleTechnologies = useCallback((ids, updates) => {
    setTechnologies(prev =>
      prev.map(tech =>
        ids.includes(tech.id) 
          ? { ...tech, ...updates, updatedAt: new Date().toISOString() } 
          : tech
      )
    );
  }, []);

  // Перезагрузка данных
  const refetch = useCallback(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return {
    technologies,
    loading,
    error,
    addTechnology,
    updateTechnology,
    removeTechnology,
    updateMultipleTechnologies,
    setTechnologies,
    refetch,
  };
}

export default useTechnologiesApi;