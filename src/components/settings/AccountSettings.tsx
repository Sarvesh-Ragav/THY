'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { LANGUAGE_OPTIONS, type AppLanguage } from '@/lib/i18n';
import { updateCustomerAccount, updateTailorAccount } from '@/lib/auth-api';

export function AccountSettings() {
  const router = useRouter();
  const { session, updateSession, logout, accessToken } = useTailorSession();
  const { language, setLanguage, darkMode, setDarkMode, t } = useAppearance();
  const isTailor = session.role === 'tailor';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [shopName, setShopName] = useState('');
  const [experience, setExperience] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (isTailor) {
      setName(session.profile?.fullName || '');
      setEmail(session.identifier.includes('@') ? session.identifier : '');
      setPhone(session.profile?.phone || '');
      setAddress(session.profile?.shopAddress || '');
      setCity(session.profile?.city || session.selectedLocation || '');
      setShopName(session.profile?.shopName || '');
      setExperience(session.profile?.yearsOfExperience || '');
      return;
    }
    setName(session.customerProfile?.fullName || '');
    setEmail(session.customerProfile?.email || (session.identifier.includes('@') ? session.identifier : ''));
    setPhone(session.customerProfile?.phone || '');
    setAddress(session.customerProfile?.address || '');
    setCity(session.customerProfile?.city || session.selectedLocation || '');
  }, [isTailor, session]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (isTailor) {
        const profile = {
          fullName: name.trim(),
          phone: phone.trim(),
          shopName: shopName.trim() || `${name.trim()}'s Boutique`,
          yearsOfExperience: experience.trim() || session.profile?.yearsOfExperience || '0',
          shopAddress: address.trim(),
          city: city.trim() || session.profile?.city,
        };
        updateSession({
          identifier: email.trim() || phone.trim() || session.identifier,
          selectedLocation: profile.city || session.selectedLocation,
          profile: {
            ...session.profile,
            ...profile,
          },
        });
        if (accessToken) {
          await updateTailorAccount(
            {
              fullName: profile.fullName,
              shopName: profile.shopName,
              yearsOfExperience: Number.parseInt(profile.yearsOfExperience, 10) || 0,
              shopAddress: profile.shopAddress,
              city: profile.city,
            },
            accessToken
          );
        }
      } else {
        const customerProfile = {
          fullName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
        };
        updateSession({
          identifier: customerProfile.email || customerProfile.phone || session.identifier,
          selectedLocation: customerProfile.city || session.selectedLocation,
          customerProfile,
        });
        if (accessToken) {
          await updateCustomerAccount(
            {
              fullName: customerProfile.fullName,
              email: customerProfile.email,
              city: customerProfile.city,
            },
            accessToken
          );
        }
      }
      showToast(t('settingsSaved'));
    } catch {
      showToast(t('settingsSaved'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {toast ? (
        <div className="thy-card px-4 py-3 text-xs font-semibold text-thy-ink border border-thy-burgundy/20">
          {toast}
        </div>
      ) : null}

      <form onSubmit={handleSave} className="thy-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-thy-ink">{t('settingsProfile')}</h2>
          <p className="text-xs text-thy-muted mt-1">{t('settingsProfileSub')}</p>
        </div>
        <label className="block space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-thy-subtle">{t('settingsName')}</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-thy-burgundy/15 bg-thy-canvas text-sm text-thy-ink outline-none focus:ring-2 focus:ring-thy-burgundy/30"
            required
          />
        </label>
        {isTailor ? (
          <label className="block space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-thy-subtle">{t('settingsShop')}</span>
            <input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-thy-burgundy/15 bg-thy-canvas text-sm text-thy-ink outline-none focus:ring-2 focus:ring-thy-burgundy/30"
            />
          </label>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-thy-subtle">{t('settingsEmail')}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-thy-burgundy/15 bg-thy-canvas text-sm text-thy-ink outline-none focus:ring-2 focus:ring-thy-burgundy/30"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-thy-subtle">{t('settingsPhone')}</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-thy-burgundy/15 bg-thy-canvas text-sm text-thy-ink outline-none focus:ring-2 focus:ring-thy-burgundy/30"
            />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-thy-subtle">
            {isTailor ? t('settingsShopAddress') : t('settingsAddress')}
          </span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-thy-burgundy/15 bg-thy-canvas text-sm text-thy-ink outline-none focus:ring-2 focus:ring-thy-burgundy/30"
          />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-thy-subtle">{t('settingsCity')}</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-thy-burgundy/15 bg-thy-canvas text-sm text-thy-ink outline-none focus:ring-2 focus:ring-thy-burgundy/30"
            />
          </label>
          {isTailor ? (
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-thy-subtle">
                {t('settingsExperience')}
              </span>
              <input
                type="number"
                min="0"
                max="80"
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-thy-burgundy/15 bg-thy-canvas text-sm text-thy-ink outline-none focus:ring-2 focus:ring-thy-burgundy/30"
              />
            </label>
          ) : null}
        </div>
        <div className="pt-1 flex justify-end">
          <button type="submit" disabled={saving} className="thy-btn px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] disabled:opacity-50">
            {saving ? t('settingsSaving') : t('settingsSave')}
          </button>
        </div>
      </form>

      <div className="thy-card p-5 space-y-3">
        <div>
          <h2 className="text-sm font-bold text-thy-ink">{t('settingsLanguage')}</h2>
          <p className="text-xs text-thy-muted mt-1">{t('settingsLanguageSub')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setLanguage(option.code as AppLanguage)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                language === option.code
                  ? 'bg-thy-burgundy text-white border-thy-burgundy'
                  : 'bg-thy-mist text-thy-ink border-thy-burgundy/15 hover:border-thy-burgundy/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="thy-card p-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-thy-ink">{t('settingsAppearance')}</h2>
          <p className="text-xs text-thy-muted mt-1">{t('settingsAppearanceSub')}</p>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode((current) => !current)}
          className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl border border-thy-burgundy/20 text-xs font-bold text-thy-ink hover:border-thy-burgundy/40"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? t('themeLight') : t('themeDark')}
        </button>
      </div>

      <div className="thy-card p-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-thy-ink">{t('settingsLogoutTitle')}</h2>
          <p className="text-xs text-thy-muted mt-1">{t('settingsLogoutSub')}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl border border-thy-burgundy/20 text-xs font-bold text-thy-burgundy hover:bg-thy-mist"
        >
          <LogOut size={14} />
          {t('settingsLogout')}
        </button>
      </div>
    </div>
  );
}
