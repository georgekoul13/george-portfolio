'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Mode = 'professional' | 'fun';

interface ModeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('professional');

  const toggleMode = () =>
    setMode((prev) => (prev === 'professional' ? 'fun' : 'professional'));

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
