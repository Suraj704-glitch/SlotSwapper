import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // <-- 1. IMPORT THE CSS FILE

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    // 2. USE THE NEW CSS CLASSES
    <div className="login-page-container">
      
      {/* Left "Promo" Panel */}
      <div className="promo-panel">
        <h1>Welcome Back!</h1>
        <p>Login to your SlotSwapper account to manage and swap your schedule.</p>
      </div>

      {/* Right "Form" Panel */}
      <div className="form-panel">
        <div className="form-container">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            
            {error && <p className="error-message">{error}</p>}
            
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
            
            <button type="submit" className="form-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
          </form>
          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 