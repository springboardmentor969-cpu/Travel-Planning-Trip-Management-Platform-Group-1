import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

const initialState = {
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, isAuthenticated: false, user: null, error: null };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.login(email, password);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          id: response.userId,
          email: response.email,
          name: response.name,
          role: response.role
        }
      });
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password, passwordConfirm) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.register(name, email, password, passwordConfirm);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          id: response.userId,
          email: response.email,
          name: response.name,
          role: response.role
        }
      });
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const updateUser = useCallback((nextUser) => {
    localStorage.setItem('user', JSON.stringify(nextUser));
    dispatch({ type: 'AUTH_UPDATE_USER', payload: nextUser });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
