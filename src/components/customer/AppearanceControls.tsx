'use client';

import React, { useId } from 'react';
import { Languages, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import { LANGUAGE_OPTIONS, type AppLanguage } from '@/lib/i18n';

export function AppearanceControls({ variant = 'nav' }: { variant?: 'nav' | 'light' }) {
  const { language, setLanguage, darkMode, setDarkMode, t } = useAppearance();
  const nav = variant === 'nav';
  const languageId = `thy-language-${useId()}`;

  return (
    <div className="flex items-center gap-1" suppressHydrationWarning>
      <label className="sr-only" htmlFor={languageId}>
        {t('languageLabel')}
      </label>
      <span
        className={`hidden sm:inline-flex items-center gap-1 min-h-11 px-1.5 ${
          nav ? 'text-white/85' : 'text-thy-ink'
        }`}
      >
        <Languages size={14} className="shrink-0" />
        <select
          id={languageId}
          value={language}
          onChange={(event) => setLanguage(event.target.value as AppLanguage)}
          className={`bg-transparent text-[10px] font-semibold uppercase tracking-[0.12em] outline-none cursor-pointer ${
            nav ? 'text-white' : 'text-thy-ink'
          }`}
          suppressHydrationWarning
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.code} value={option.code} className="text-thy-ink">
              {option.short}
            </option>
          ))}
        </select>
      </span>
      <button
        type="button"
        onClick={() => setDarkMode((current) => !current)}
        className={
          nav
            ? 'thy-nav-icon inline-flex items-center justify-center h-11 w-11'
            : 'inline-flex items-center justify-center h-11 w-11 border border-thy-burgundy/20 text-thy-ink hover:border-thy-burgundy/40'
        }
        aria-label={darkMode ? t('themeLight') : t('themeDark')}
        title={darkMode ? t('themeLight') : t('themeDark')}
        suppressHydrationWarning
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
}
