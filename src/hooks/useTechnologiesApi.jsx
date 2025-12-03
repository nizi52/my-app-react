import { useState, useEffect, useRef } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Загрузка технологий из API
  const fetchTechnologies = async () => {
    // Отменяем предыдущий запрос, если он существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для текущего запроса
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Имитация API запроса с задержкой и возможностью отмены
      const response = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          const savedData = localStorage.getItem('techTrackerData');
          
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            resolve({
              ok: true,
              json: async () => parsedData
            });
          } else {
            const initialTechnologies = [
              {
                id: 1,
                title: 'React Components',
                description: 'Изучение базовых компонентов',
                status: 'not-started',
                notes: '',
                category: 'frontend',
                difficulty: 'beginner'
              },
              {
                id: 2,
                title: 'JSX Syntax',
                description: 'Освоение синтаксиса JSX',
                status: 'not-started',
                notes: '',
                category: 'frontend',
                difficulty: 'beginner'
              },
              {
                id: 3,
                title: 'State Management',
                description: 'Работа с состоянием компонентов',
                status: 'not-started',
                notes: '',
                category: 'frontend',
                difficulty: 'intermediate'
              },
              {
                id: 4,
                title: 'Props',
                description: 'Передача данных между компонентами',
                status: 'not-started',
                notes: '',
                category: 'frontend',
                difficulty: 'beginner'
              }
            ];
            
            localStorage.setItem('techTrackerData', JSON.stringify(initialTechnologies));
            resolve({
              ok: true,
              json: async () => initialTechnologies
            });
          }
        }, 500);

        // Обработка отмены запроса
        abortControllerRef.current.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Запрос отменен', 'AbortError'));
        });
      });

      const data = await response.json();
      setTechnologies(data);

    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err.name !== 'AbortError') {
        setError('Не удалось загрузить технологии');
        console.error('Ошибка загрузки:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Добавление новой технологии
  const addTechnology = async (techData) => {
    const abortController = new AbortController();
    
    try {
      // Имитация API запроса с возможностью отмены
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          const newTech = {
            id: Date.now(),
            ...techData,
            createdAt: new Date().toISOString()
          };

          setTechnologies(prev => [...prev, newTech]);
          
          // Обновляем localStorage
          const updatedTechnologies = [...technologies, newTech];
          localStorage.setItem('techTrackerData', JSON.stringify(updatedTechnologies));
          
          resolve(newTech);
        }, 300);

        abortController.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Запрос отменен', 'AbortError'));
        });
      });

    } catch (err) {
      if (err.name !== 'AbortError') {
        throw new Error('Не удалось добавить технологию');
      }
      throw err;
    } finally {
      abortController.abort();
    }
  };

  // Обновление технологии
  const updateTechnology = async (id, updatedData) => {
    const abortController = new AbortController();
    
    try {
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, ...updatedData } : tech
          );
          
          setTechnologies(updated);
          localStorage.setItem('techTrackerData', JSON.stringify(updated));
          
          resolve(updated.find(tech => tech.id === id));
        }, 200);

        abortController.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Запрос отменен', 'AbortError'));
        });
      });

    } catch (err) {
      if (err.name !== 'AbortError') {
        throw new Error('Не удалось обновить технологию');
      }
      throw err;
    } finally {
      abortController.abort();
    }
  };

  // Удаление технологии
  const deleteTechnology = async (id) => {
    const abortController = new AbortController();
    
    try {
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          const filtered = technologies.filter(tech => tech.id !== id);
          setTechnologies(filtered);
          localStorage.setItem('techTrackerData', JSON.stringify(filtered));
          resolve();
        }, 200);

        abortController.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Запрос отменен', 'AbortError'));
        });
      });

    } catch (err) {
      if (err.name !== 'AbortError') {
        throw new Error('Не удалось удалить технологию');
      }
      throw err;
    } finally {
      abortController.abort();
    }
  };

  // Загружаем технологии при монтировании
  useEffect(() => {
    fetchTechnologies();

    // Очистка при размонтировании
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    setTechnologies
  };
}

export default useTechnologiesApi;