import React, { createContext, useReducer, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// --- Set up Axios defaults ---
const API_URL = 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

// 1. Create the Context
const AuthContext = createContext();

// 2. Define the Initial State
//    ADD isLoading: true
const initialState = {
  user: null,
  token: null,
  isLoading: true, // <-- ADD THIS
};

// 3. Define the Reducer
//    ADD SET_INITIALIZED
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      };
    // This action will run after we check localStorage
    case 'SET_INITIALIZED': // <-- ADD THIS CASE
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false, // We are now finished loading
      };
    default:
      return state;
  }
};

// 4. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // --- THIS IS THE NEW INITIALIZATION LOGIC ---
  // This useEffect will run ONCE when the app loads
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          // Token is expired
          localStorage.removeItem('token');
          dispatch({ type: 'SET_INITIALIZED', payload: { user: null, token: null } });
        } else {
          // Token is valid
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          dispatch({
            type: 'SET_INITIALIZED',
            payload: { user: decodedToken, token: token },
          });
        }
      } else {
        // No token found
        dispatch({ type: 'SET_INITIALIZED', payload: { user: null, token: null } });
      }
    } catch (err) {
      // Something went wrong
      console.error('Initialization error:', err);
      dispatch({ type: 'SET_INITIALIZED', payload: { user: null, token: null } });
    }
  }, []); // The empty array [] means this runs only once

  // This useEffect updates the token ONLY when state.token changes (i.e., on login/logout)
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // --- Helper Functions ---
  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token } = res.data;
      const decoded = jwtDecode(token);

      dispatch({
        type: 'LOGIN',
        payload: { user: decoded, token: token },
      });
    } catch (err) {
      // ... (your existing error handling) ...
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      } else {
        console.error('Login API Error:', err.message);
        throw new Error('Login failed. Server may be down or a network error occurred.');
      }
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      const { token } = res.data;
      const decoded = jwtDecode(token);
      dispatch({
        type: 'LOGIN',
        payload: { user: decoded, token: token },
      });
    } catch (err) {
      // ... (your existing error handling) ...
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      } else {
        console.error('Register API Error:', err.message);
        throw new Error('Registration failed. Server may be down or a network error occurred.');
      }
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isLoading: state.isLoading, // <-- EXPORT THE LOADING STATE
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 5. Create a custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};