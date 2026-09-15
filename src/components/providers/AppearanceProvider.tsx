'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { APP_LANGUAGES, type AppLanguage, type UiKey, translateUi } from '@/lib/i18n';

const STORAGE_KEY = 'thy-appearance';

interface AppearanceState {
  language: AppLanguage;
  darkMode: boolean;
}

interface AppearanceContextValue extends AppearanceState {
  setLanguage: (language: AppLanguage) => void;
  setDarkMode: (darkMode: boolean | ((current: boolean) => boolean)) => void;
  t: (key: UiKey) => string;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function isLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && APP_LANGUAGES.includes(value as AppLanguage);
}

function readStored(): AppearanceState {
  if (typeof window === 'undefined') return { language: 'en', darkMode: false };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') as Partial<AppearanceState>;
    return {
      language: isLanguage(parsed.language) ? parsed.language : 'en',
      darkMode: Boolean(parsed.darkMode),
    };
  } catch {
    return { language: 'en', darkMode: false };
  }
}

function persist(state: AppearanceState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyToDocument(state: AppearanceState) {
  const root = document.documentElement;
  root.lang = state.language;
  root.classList.toggle('dark', state.darkMode);
  root.style.colorScheme = state.darkMode ? 'dark' : 'light';
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppearanceState>({ language: 'en', darkMode: false });

  useEffect(() => {
    const stored = readStored();
    setState(stored);
    applyToDocument(stored);
  }, []);

  const setLanguage = useCallback((language: AppLanguage) => {
    setState((current) => {
      const next = { ...current, language };
      persist(next);
      applyToDocument(next);
      return next;
    });
  }, []);

  const setDarkMode = useCallback((darkMode: boolean | ((current: boolean) => boolean)) => {
    setState((current) => {
      const nextValue = typeof darkMode === 'function' ? darkMode(current.darkMode) : darkMode;
      const next = { ...current, darkMode: nextValue };
      persist(next);
      applyToDocument(next);
      return next;
    });
  }, []);

  const t = useCallback((key: UiKey) => translateUi(state.language, key), [state.language]);

  const value = useMemo(
    () => ({ ...state, setLanguage, setDarkMode, t }),
    [setDarkMode, setLanguage, state, t]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return context;
}
