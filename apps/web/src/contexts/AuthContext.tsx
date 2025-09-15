'use client';

import { LOGIN_MUTATION, ME_QUERY, REGISTER_MUTATION } from '@/lib/graphql/queries';
import { UserRole } from '@/types';
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  isActive: boolean;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, name: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasFetchedUserData = useRef(false);

  // Apollo hooks
  const apolloClient = useApolloClient();
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [getMe, { loading: meLoading }] = useLazyQuery(ME_QUERY);

  const isAuthenticated = !!user && !!token;

  const fetchUserData = useCallback(async (authToken: string) => {
    // Prevent multiple simultaneous calls
    if (hasFetchedUserData.current) {
      return;
    }

    hasFetchedUserData.current = true;

    try {
      const { data, error } = await getMe();

      if (error) {
        throw new Error(error.message || 'Failed to fetch user data');
      }

      if (data?.me) {
        setUser(data.me);
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Clear invalid token
      localStorage.removeItem('auth-token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getMe]);

  useEffect(() => {
    // Check for existing token on mount (only on client side)
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth-token');
      if (storedToken) {
        setToken(storedToken);
        // Fetch user data
        fetchUserData(storedToken);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchUserData]);

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const result = await loginMutation({
        variables: {
          input: {
            usernameOrEmail,
            password,
          },
        },
      });

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Login failed');
      }

      if (result.data?.login) {
        const { access_token, user: userData } = result.data.login;

        // Store token (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', access_token);
        }
        setToken(access_token);
        setUser(userData);
        hasFetchedUserData.current = true; // Mark as fetched

        toast.success('Login successful!');
        return true;
      } else {
        throw new Error('No login data received');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    name: string,
    password: string,
    role: string = 'VIEWER'
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const result = await registerMutation({
        variables: {
          input: {
            username,
            email,
            name,
            password,
            role: role.toUpperCase(),
          },
        },
      });

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Registration failed');
      }

      if (result.data?.register) {
        const { access_token, user: userData } = result.data.register;

        // Store token (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', access_token);
        }
        setToken(access_token);
        setUser(userData);
        hasFetchedUserData.current = true; // Mark as fetched

        toast.success('Registration successful!');
        return true;
      } else {
        throw new Error('No registration data received');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
    setToken(null);
    setUser(null);
    hasFetchedUserData.current = false; // Reset flag to allow future fetches

    // Clear Apollo cache to remove user-specific data
    apolloClient.clearStore();

    toast.success('Logged out successfully');
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
