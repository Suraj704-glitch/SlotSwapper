import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import RequestsPage from './pages/RequestsPage';

// --- Navbar Component (Updated Styles) ---
const Navbar = () => {
  const { user, logout } = useAuth();

  // New dark theme styles for the navbar
  const navStyle = {
    backgroundColor: '#343a40', // Dark background
    padding: '10px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  const logoStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px', // Space between links
  };

  const linkStyle = {
    color: '#f8f9fa', // Light text
    textDecoration: 'none',
    padding: '8px 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  };
  
  // Style for the logout button
  const buttonStyle = {
    backgroundColor: '#6C63FF', // Purple button (matches login)
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>SlotSwapper</Link>
      {user && (
        <div style={navLinksStyle}>
          {/* We use <Link> for navigation */}
          <Link to="/dashboard" style={linkStyle} 
                onMouseOver={e => e.target.style.backgroundColor='#495057'}
                onMouseOut={e => e.target.style.backgroundColor='transparent'}>
            Dashboard
          </Link>
          <Link to="/marketplace" style={linkStyle}
                onMouseOver={e => e.target.style.backgroundColor='#495057'}
                onMouseOut={e => e.target.style.backgroundColor='transparent'}>
            Marketplace
          </Link>
          <Link to="/requests" style={linkStyle}
                onMouseOver={e => e.target.style.backgroundColor='#495057'}
                onMouseOut={e => e.target.style.backgroundColor='transparent'}>
            Requests
          </Link>
          <button onClick={logout} style={buttonStyle}>Logout</button>
        </div>
      )}
    </nav>
  );
};
// --- End of Navbar Component ---

function App() {
  return (
    <div className="App">
      <Navbar /> {/* This navbar now has the new style */}
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/" element={<DashboardPage />} /> 
        </Route>
        
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;