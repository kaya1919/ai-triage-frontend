// src/context/AuthContext.tsx
import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthCtx {
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}
export const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('user') || null);
  const login = (name: string) => { setUserName(name); localStorage.setItem('user', name); };
  const logout = () => { setUserName(null); localStorage.removeItem('user'); };
  return <AuthContext.Provider value={{ userName, login, logout }}>{children}</AuthContext.Provider>;
};
