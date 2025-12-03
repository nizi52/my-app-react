import { Link } from 'react-router-dom';

function TechnologyList({ technologies }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Все технологии</h1>
        <Link to="/add-technology" className="btn btn-primary">
          + Добавить технологию
        </Link>
      </div>

      <div className="technologies-grid">
        {technologies.map(tech => (
          <div key={tech.id} className="technology-item">
            <h3>{tech.title}</h3>
            <p>{tech.description}</p>
            <div className="technology-meta">
              <span className={`status status-${tech.status}`}>
                {tech.status === 'completed' && '✅ '}
                {tech.status === 'in-progress' && '🔄 '}
                {tech.status === 'not-started' && '⏳ '}
                {tech.status}
              </span>
              <Link to={`/technology/${tech.id}`} className="btn-link">
                Подробнее →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnologyList;