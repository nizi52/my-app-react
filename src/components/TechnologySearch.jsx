import { useState, useRef, useEffect } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch, technologies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {

        const filtered = technologies.filter(tech =>
          tech.title.toLowerCase().includes(value.toLowerCase()) ||
          tech.description.toLowerCase().includes(value.toLowerCase()) ||
          tech.category?.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5); 
        
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }

      onSearch(value);
    }, 300);
  };

  const handleSuggestionClick = (tech) => {
    setSearchTerm(tech.title);
    setShowSuggestions(false);
    onSearch(tech.title);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="technology-search">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="🔍 Поиск технологий по названию, описанию..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={clearSearch}
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map(tech => (
              <div
                key={tech.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(tech)}
              >
                <div className="suggestion-title">{tech.title}</div>
                <div className="suggestion-description">{tech.description}</div>
                {tech.category && (
                  <span className="suggestion-category">{tech.category}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologySearch;