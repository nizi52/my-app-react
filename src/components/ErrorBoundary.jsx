import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Можно отправить ошибку на сервер для логирования
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          padding: '40px',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ color: '#ff4757', marginBottom: '20px' }}>
            ⚠️ Что-то пошло не так
          </h2>
          
          <p style={{ marginBottom: '20px', color: '#555' }}>
            Приложение столкнулось с ошибкой. Пожалуйста, попробуйте перезагрузить страницу или вернуться на главную.
          </p>
          
          <div style={{ marginBottom: '30px' }}>
            <button 
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Перезагрузить страницу
            </button>
            
            <button 
              onClick={this.handleGoHome}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              На главную
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              textAlign: 'left',
              marginTop: '20px',
              border: '1px solid #ddd'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Детали ошибки (только для разработки)
              </summary>
              <pre style={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '12px',
                color: '#e74c3c',
                marginTop: '10px'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;