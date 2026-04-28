import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tractor_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tractor_user');
    if (savedUser && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    // Fake authentication logic
    if (username && password) {
      const mockUser = {
        id: '1',
        username: username,
        role: 'operator',
        name: username.charAt(0).toUpperCase() + username.slice(1)
      };
      const mockToken = 'fake-jwt-token-' + Math.random().toString(36).substr(2);
      
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('tractor_token', mockToken);
      localStorage.setItem('tractor_user', JSON.stringify(mockUser));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const signup = async () => {
    // Fake signup logic
    return { success: true };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tractor_token');
    localStorage.removeItem('tractor_user');
  };

  const authenticatedFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
