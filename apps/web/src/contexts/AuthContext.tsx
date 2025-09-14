'use client';

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'developer' | 'viewer';
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

  const isAuthenticated = !!user && !!token;

  const fetchUserData = useCallback(async (authToken: string) => {
    // Prevent multiple simultaneous calls
    if (hasFetchedUserData.current) {
      return;
    }

    hasFetchedUserData.current = true;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          query: `
            query Me {
              me {
                id
                email
                username
                name
                role
                organizationId
                isActive
                avatar
                lastLoginAt
                createdAt
                updatedAt
              }
            }
          `,
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0]?.message || 'Failed to fetch user data');
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
  }, []);

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                access_token
                user {
                  id
                  email
                  username
                  name
                  role
                  organizationId
                  isActive
                  avatar
                  lastLoginAt
                  createdAt
                  updatedAt
                }
              }
            }
          `,
          variables: {
            input: {
              usernameOrEmail,
              password,
            },
          },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0]?.message || 'Login failed');
      }

      if (data?.login) {
        const { access_token, user: userData } = data.login;

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
    role: string = 'viewer'
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Register($input: RegisterInput!) {
              register(input: $input) {
                access_token
                user {
                  id
                  email
                  username
                  name
                  role
                  organizationId
                  isActive
                  avatar
                  lastLoginAt
                  createdAt
                  updatedAt
                }
              }
            }
          `,
          variables: {
            input: {
              username,
              email,
              name,
              password,
              role: role.toUpperCase(),
            },
          },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0]?.message || 'Registration failed');
      }

      if (data?.register) {
        const { access_token, user: userData } = data.register;

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
