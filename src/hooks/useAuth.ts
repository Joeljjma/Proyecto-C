import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  recoverPassword: (username: string, securityAnswer: string, newPassword: string) => Promise<boolean>;
  getSecurityQuestion: (username: string) => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [users, setUsers] = useLocalStorage<User[]>('community_users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('current_user', null);

  useEffect(() => {
    // Initialize default admin user if no users exist
    if (users.length === 0) {
      const defaultAdmin: User = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Administrador del Sistema',
        email: 'admin@comunidad.local',
        role: 'admin',
        securityQuestion: '¿Cuál es el nombre de tu primera mascota?',
        securityAnswer: 'max',
        createdAt: new Date()
      };
      setUsers([defaultAdmin]);
    }
  }, [users.length, setUsers]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    const existingUser = users.find(u => u.username === userData.username);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    setUsers([...users, newUser]);
    return true;
  };

  const recoverPassword = async (username: string, securityAnswer: string, newPassword: string): Promise<boolean> => {
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1 && users[userIndex].securityAnswer.toLowerCase() === securityAnswer.toLowerCase()) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
      setUsers(updatedUsers);
      return true;
    }
    return false;
  };

  const getSecurityQuestion = (username: string): string | null => {
    const user = users.find(u => u.username === username);
    return user ? user.securityQuestion : null;
  };

  return {
    user: currentUser,
    login,
    logout,
    register,
    recoverPassword,
    getSecurityQuestion
  };
};

export { AuthContext };