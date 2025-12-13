import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch, technologies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Мемоизированная функция поиска
  const searchTechnologies = useCallback((query) => {
    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    // Имитация асинхронного поиска
    setIsSearching(true);
    
    setTimeout(() => {
      try {
        if (query.trim()) {
          const filtered = technologies.filter(tech =>
            tech.title.toLowerCase().includes(query.toLowerCase()) ||
            tech.description.toLowerCase().includes(query.toLowerCase()) ||
            (tech.category && tech.category.toLowerCase().includes(query.toLowerCase())) ||
            (tech.notes && tech.notes.toLowerCase().includes(query.toLowerCase()))
          ).slice(0, 5);
          
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
        
        setIsSearching(false);
        onSearch(query);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
          setIsSearching(false);
        }
      }
    }, 100); // Имитация задержки сети
  }, [technologies, onSearch]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Очищаем предыдущий таймаут
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймаут (debounce)
    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 300); // Debounce 300ms
  }, [searchTechnologies]);

  const handleSuggestionClick = useCallback((tech) => {
    setSearchTerm(tech.title);
    setShowSuggestions(false);
    onSearch(tech.title);
  }, [onSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  }, [onSearch]);

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Мемоизированные подсказки
  const memoizedSuggestions = useMemo(() => suggestions, [suggestions]);

  return (
    <div className="technology-search">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="🔍 Поиск технологий по названию, описанию, категории или заметкам..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            aria-label="Поиск технологий"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showSuggestions}
          />
          {isSearching && (
            <div 
              className="search-spinner" 
              aria-label="Идет поиск"
              style={{
                position: 'absolute',
                right: '50px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2em'
              }}
            >
              🔄
            </div>
          )}
          {searchTerm && !isSearching && (
            <button 
              className="clear-search-btn"
              onClick={clearSearch}
              title="Очистить поиск"
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>
        
        {showSuggestions && memoizedSuggestions.length > 0 && (
          <div 
            className="suggestions-dropdown" 
            role="listbox"
            id="search-suggestions"
          >
            {memoizedSuggestions.map(tech => (
              <div
                key={tech.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(tech)}
                role="option"
                aria-selected="false"
                tabIndex="0"
                onKeyPress={(e) => e.key === 'Enter' && handleSuggestionClick(tech)}
              >
                <div className="suggestion-title">{tech.title}</div>
                <div className="suggestion-description">
                  {tech.description.length > 100 
                    ? `${tech.description.substring(0, 100)}...` 
                    : tech.description}
                </div>
                {tech.category && (
                  <span className="suggestion-category">{tech.category}</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        {showSuggestions && searchTerm && memoizedSuggestions.length === 0 && !isSearching && (
          <div className="suggestions-dropdown">
            <div className="suggestion-item" style={{ textAlign: 'center', color: '#999' }}>
              По запросу "{searchTerm}" ничего не найдено
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(TechnologySearch);