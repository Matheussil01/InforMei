import { useState, useEffect } from 'react';

export interface LocalUser {
  id: number;
  email: string;
  name: string;
  nomeEmpresa: string;
  cnpj: string;
  role: string;
}

export function useLocalAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUser && isLoggedIn === 'true') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout,
  };
}
