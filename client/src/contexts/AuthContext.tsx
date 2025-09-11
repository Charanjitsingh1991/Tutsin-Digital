import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Client } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  client: Client | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, company?: string, phone?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("tutsin-client-token");
    if (storedToken) {
      setToken(storedToken);
      checkAuth(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setClient(data.client);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("tutsin-client-token");
        setToken(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("tutsin-client-token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", {
      email,
      password,
    });

    const data = await response.json();
    const { token: newToken, client: newClient } = data;
    setToken(newToken);
    setClient(newClient);
    localStorage.setItem("tutsin-client-token", newToken);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    company?: string,
    phone?: string
  ) => {
    const response = await apiRequest("POST", "/api/auth/register", {
      firstName,
      lastName,
      email,
      password,
      company,
      phone,
    });

    const data = await response.json();
    const { token: newToken, client: newClient } = data;
    setToken(newToken);
    setClient(newClient);
    localStorage.setItem("tutsin-client-token", newToken);
  };

  const logout = () => {
    if (token) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {
        // Ignore logout errors, just clear local state
      });
    }
    
    setClient(null);
    setToken(null);
    localStorage.removeItem("tutsin-client-token");
  };

  const value = {
    client,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}