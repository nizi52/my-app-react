import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddTechnology({ onAdd }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const newTechnology = {
      title: title.trim(),
      description: description.trim(),
      status: 'not-started',
      notes: ''
    };

    onAdd(newTechnology);
    navigate('/');
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-link">
          ← Назад на главную
        </Link>
        <h1>Добавить новую технологию</h1>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-group">
          <label htmlFor="title">Название технологии *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: React Hooks"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишите, что вы будете изучать..."
            rows="4"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            Добавить технологию
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;