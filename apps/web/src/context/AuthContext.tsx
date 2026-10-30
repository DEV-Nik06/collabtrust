import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  role: 'brand' | 'creator';
  profileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: 'brand' | 'creator') => Promise<User>;
  logout: () => Promise<void>;
  quickLogin: (role: 'brand' | 'creator') => Promise<User>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('collabtrust_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('collabtrust_token');
      if (!storedToken) {
        // Auto-initialize demo brand session for instant testing if no session exists
        try {
          await quickLogin('brand');
        } catch {
          setLoading(false);
        }
        return;
      }

      try {
        const data = await api.get<{ profile: any }>('/users/me/profile');
        const storedRole = (localStorage.getItem('collabtrust_role') as 'brand' | 'creator') || 'brand';
        const storedEmail = localStorage.getItem('collabtrust_email') || 'user@example.com';
        const storedId = localStorage.getItem('collabtrust_userId') || 'user_1';

        setUser({
          id: storedId,
          email: storedEmail,
          role: storedRole,
          profileComplete: data.profile?.profileComplete ?? true,
        });
        setToken(storedToken);
      } catch {
        localStorage.removeItem('collabtrust_token');
        localStorage.removeItem('collabtrust_role');
        localStorage.removeItem('collabtrust_email');
        localStorage.removeItem('collabtrust_userId');
        try {
          await quickLogin('brand');
        } catch {
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });

    localStorage.setItem('collabtrust_token', res.token);
    localStorage.setItem('collabtrust_role', res.user.role);
    localStorage.setItem('collabtrust_email', res.user.email);
    localStorage.setItem('collabtrust_userId', res.user.id);

    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res.user;
  };

  const register = async (email: string, password: string, role: 'brand' | 'creator'): Promise<User> => {
    const res = await api.post<{ user: User; token: string }>('/auth/register', {
      email,
      password,
      role,
    });

    localStorage.setItem('collabtrust_token', res.token);
    localStorage.setItem('collabtrust_role', res.user.role);
    localStorage.setItem('collabtrust_email', res.user.email);
    localStorage.setItem('collabtrust_userId', res.user.id);

    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res.user;
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('collabtrust_token');
      localStorage.removeItem('collabtrust_role');
      localStorage.removeItem('collabtrust_email');
      localStorage.removeItem('collabtrust_userId');
      setToken(null);
      setUser(null);
    }
  };

  const quickLogin = async (role: 'brand' | 'creator'): Promise<User> => {
    const email = role === 'brand' ? 'brand@ecoglow.com' : 'alex@creators.example.com';
    const password = 'Password123!';
    return login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickLogin,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
