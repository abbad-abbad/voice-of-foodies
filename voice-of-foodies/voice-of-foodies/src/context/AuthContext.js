import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, clearToken, fetchCurrentUser, logoutUser } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (getToken()) {
        const restored = await fetchCurrentUser();
        if (restored) {
          setUser(restored);
        } else {
          clearToken(); // stale/expired token
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
