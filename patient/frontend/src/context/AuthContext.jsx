import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('userToken');
    const u = localStorage.getItem('userData');
    const staff = localStorage.getItem('isStaff') === 'true';
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
    setIsStaff(staff);
    setLoading(false);
  }, []);

  const signIn = (t, userData, staff = false) => {
    localStorage.setItem('userToken', t);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isStaff', String(!!staff));
    setToken(t);
    setUser(userData);
    setIsStaff(!!staff);
  };

  const signOut = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isStaff');
    setToken(null);
    setUser(null);
    setIsStaff(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isStaff, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
