import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // <-- 1. IMPORT THE SAME CSS FILE

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
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
        <h1>Create Your Account</h1>
        <p>Join SlotSwapper today to start managing your schedule and trading time slots with peers.</p>
      </div>

      {/* Right "Form" Panel */}
      <div className="form-panel">
        <div className="form-container">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            
            {error && <p className="error-message">{error}</p>}
            
            <div>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
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
                minLength={6}
              />
            </div>
            
            <button type="submit" className="form-button" disabled={loading} style={{marginTop: '10px'}}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
          </form>
          <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;