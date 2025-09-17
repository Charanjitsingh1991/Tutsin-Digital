import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  lastLoginAt?: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('admin-token');
    if (storedToken) {
      setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await apiRequest('GET', '/api/admin/auth/me', undefined, {
        Authorization: `Bearer ${tokenToVerify}`
      });
      
      if (response.admin) {
        setAdmin(response.admin);
        setToken(tokenToVerify);
      } else {
        // Invalid token
        localStorage.removeItem('admin-token');
        setToken(null);
        setAdmin(null);
      }
    } catch (error) {
      // Token verification failed
      localStorage.removeItem('admin-token');
      setToken(null);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/api/admin/auth/login', {
        email,
        password
      });

      if (response.token && response.admin) {
        setToken(response.token);
        setAdmin(response.admin);
        localStorage.setItem('admin-token', response.token);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiRequest('POST', '/api/admin/auth/logout', undefined, {
          Authorization: `Bearer ${token}`
        });
      }
    } catch (error) {
      // Ignore logout errors
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setAdmin(null);
      localStorage.removeItem('admin-token');
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    
    // Super admin has all permissions
    if (admin.role === 'super_admin') return true;
    
    return admin.permissions.includes(permission);
  };

  const value: AdminAuthContextType = {
    admin,
    token,
    login,
    logout,
    isAuthenticated: !!admin && !!token,
    isLoading,
    hasPermission
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

