import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('shapa_token');
    if (token) {
      api.get('/auth/me')
        .then(setUser)
        .catch(() => localStorage.removeItem('shapa_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, username, password }) => {
    const { token, user } = await api.post('/auth/login', { email, username, password });
    localStorage.setItem('shapa_token', token);
    setUser(user);
    return user;
  };

  const register = async ({ firstName, lastName, email, password }) => {
    const { token, user } = await api.post('/auth/register', { firstName, lastName, email, password });
    localStorage.setItem('shapa_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('shapa_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
