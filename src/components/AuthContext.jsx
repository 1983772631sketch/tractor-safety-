import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Always authenticated "fake" user
  const [user] = useState({
    id: 'operator-001',
    username: 'operator',
    role: 'operator',
    name: 'Operator'
  });
  const [token] = useState('fake-token-bypass');
  const [loading] = useState(false);

  const login = () => ({ success: true });
  const logout = () => {};

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
    <AuthContext.Provider value={{ user, token, loading, login, logout, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
