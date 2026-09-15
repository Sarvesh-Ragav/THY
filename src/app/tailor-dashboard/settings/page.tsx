'use client';

import React, { useState, createContext, useContext } from 'react';
import { 
  User, 
  Languages, 
  Sun, 
  Moon, 
  Shield, 
  Ruler, 
  Bell, 
  Lock, 
  Smartphone, 
  LogOut, 
  Globe, 
  Download, 
  HardDrive, 
  Camera, 
  ChevronRight, 
  CheckCircle2, 
  Scissors, 
  Trash2,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    brandName: 'THY Master Atelier',
    subtitle: 'Tailor Studio & Account Settings',

    toastSaveSuccess: 'Settings saved successfully!',
    toastCacheCleared: 'Local app cache and temporary files cleared.',
    toastDataExported: 'Your atelier profile JSON data file has been downloaded.',
    toastPassUpdated: 'Password updated successfully!',
    toastSessionRevoked: 'Session revoked successfully!',

    tabProfile: 'Profile & Personal Info',
    tabLanguage: 'Language & Localization',
    tabAppearance: 'Appearance & Theme',
    tabSecurity: 'Account Security & 2FA',
    tabTailoring: 'Measurements & Fitting',
    tabNotifications: 'Notifications & WhatsApp',
    tabPrivacy: 'Privacy & Data Control',

    profileTitle: 'Master Tailor & Studio Info',
    profileSub: 'Manage your primary contact and studio location details used for customer orders and doorstep pickups.',
    changePhoto: 'Upload New Photo',
    fullName: 'Master Tailor Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    pickupAddress: 'Default Studio Pickup Address',
    preferredStudio: 'Studio Atelier Name',
    saveProfileBtn: 'Save Studio Profile Changes',

    languageTitle: 'Language & Localization System',
    centralizedLangTitle: 'Centralized Global Preference',
    centralizedLangSub: 'Selecting a language here dynamically translates every section, menu item, measurement field, notification label, and action across the studio application.',
    langSelectLabel: 'Choose Application Language',

    appearanceTitle: 'Appearance & Visual Theme',
    colorTheme: 'Color Theme Mode',
    themeLight: 'Light Theme Mode',
    themeDark: 'Dark Theme Mode',
    fontSizeLabel: 'Text & Font Size Preference',
    fontSmall: 'Compact / Small',
    fontMedium: 'Standard / Medium',
    fontLarge: 'Large / Accessible',
    highContrastTitle: 'High Contrast Mode',
    highContrastSub: 'Enhance text contrast for better daylight visibility in the workshop.',

    securityTitle: 'Account Security & Active Sessions',
    securitySub: 'Ensure your atelier credentials and active orders remain protected.',
    changePassHeading: 'Change Studio Password',
    currentPass: 'Current Password',
    newPass: 'New Password',
    confirmPass: 'Confirm New Password',
    passStrengthLabel: 'Password Strength',
    updatePassBtn: 'Update Password',
    twoFactorTitle: 'Two-Factor Authentication (2FA)',
    twoFactorSub: 'Add an extra layer of security for accepting high-value orders and approving payouts.',
    twoFactorQR: 'Scan this QR code using Google Authenticator or Authy app:',
    twoFactorEnabled: '2FA Authentication Enabled',
    sessionsHeading: 'Active Login Sessions & Devices',
    sessionsSub: 'These devices are currently logged into your THY Atelier account.',
    currentSessionBadge: 'Current Active Device',
    logoutDevice: 'Revoke Access',
    logoutAllDevices: 'Log Out All Other Devices',
    session1: 'Chrome on Windows 11 • Atelier Hub (Current)',
    session2: 'WhatsApp Web Automation • Studio Terminal',
    session3: 'THY Tailor App on iPhone 15 Pro',

    tailoringTitle: 'Body Measurements & Fitting Grid',
    tailoringSub: 'Set standard sizing references and unit preferences used across your client fitting orders.',
    unitLabel: 'Measurement Unit System',
    inches: 'Inches (in)',
    centimeters: 'Centimeters (cm)',
    savedMeasurements: 'Standard Sizing Reference Grid',
    chest: 'Chest / Bust',
    waist: 'Waist',
    hips: 'Hips',
    shoulder: 'Shoulder Width',
    sleeve: 'Sleeve Length',
    neck: 'Neck Circumference',
    fitPreference: 'Default Garment Fit Style',
    fitSlim: 'Slim Fit (Snug & Tailored)',
    fitRegular: 'Regular Fit (Standard Comfort)',
    fitRelaxed: 'Relaxed Fit (Roomy & Loose)',
    fabricCarePref: 'Fabric Pre-Treatment Protocol',
    fabricCareSub: 'Automatically log fabric pre-shrinking prior to cutting cotton and silk garments.',
    saveMeasurementsBtn: 'Save Fitting Settings',

    notificationsTitle: 'Notifications & Dispatch Alerts',
    notificationsSub: 'Choose how client queries, pickup logistics, and system alerts notify your studio.',
    notifWhatsapp: 'WhatsApp Order & Client Updates',
    notifWhatsappSub: 'Send automated photos to clients when fabric cutting, stitching, or pressing begins.',
    notifSMS: 'SMS Logistics Dispatch Alerts',
    notifSMSSub: 'Receive alerts when doorstep pickup agents drop off client fabrics.',
    notifTailorMsg: 'Direct Client Consultation Alerts',
    notifTailorMsgSub: 'Receive direct inquiry notifications from active clients.',
    quietHoursTitle: 'Enable Workshop Quiet Hours',
    quietHoursSub: 'Pause non-urgent order notifications between 10:00 PM and 7:00 AM.',

    privacyTitle: 'Privacy & Data Control',
    privacySub: 'Manage data access permissions, studio profile exports, and account actions.',
    measurementPrivacy: 'Allow Client Access to Sizing Records',
    measurementPrivacySub: 'Grant clients permission to view verified fitting measurements.',
    exportDataTitle: 'Export Atelier Data Profile',
    exportDataSub: 'Download a complete JSON backup of your studio profile, measurements, and preferences.',
    exportBtn: 'Download Profile (JSON)',
    clearCacheTitle: 'Clear Local Studio Cache',
    clearCacheSub: 'Free up storage by clearing cached garment imagery and temporary data.',
    clearCacheBtn: 'Clear Local Cache',

    dangerZoneTitle: 'Studio Account Actions',
    logoutAccount: 'Log Out of Studio Account',
    deleteAccount: 'Delete Atelier Account',
    logoutModalTitle: 'Log Out of THY Tailor Portal?',
    logoutModalSub: 'Your studio data and order history will stay safely synchronized in your cloud account.',
    cancelBtn: 'Cancel',
    confirmLogoutBtn: 'Yes, Log Out',
    deleteModalTitle: 'Permanently Delete Studio Account?',
    deleteModalSub: 'This action is permanent and cannot be undone. All saved measurements, order histories, and earnings records will be erased.',
    confirmDeleteBtn: 'Permanently Delete Account'
  },
  hi: {
    brandName: 'THY मास्टर स्टुडियो',
    subtitle: 'दर्जी स्टुडियो और खाता सेटिंग्स',
    toastSaveSuccess: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
    toastCacheCleared: 'कैश और फ़ाइलें साफ़ कर दी गईं।',
    toastDataExported: 'JSON फ़ाइल डाउनलोड हो गई है।',
    toastPassUpdated: 'पासवर्ड अपडेट किया गया!',
    toastSessionRevoked: 'उपकरण सत्र समाप्त कर दिया गया!',
    tabProfile: 'प्रोफ़ाइल जानकारी',
    tabLanguage: 'भाषा और स्थानीयकरण',
    tabAppearance: 'स्वरूप और थीम',
    tabSecurity: 'खाता सुरक्षा और 2FA',
    tabTailoring: 'नाप और फिटिंग ग्रिड',
    tabNotifications: 'सूचनाएं और अलर्ट',
    tabPrivacy: 'गोपनीयता और डेटा',
    profileTitle: 'मास्टर दर्जी और स्टुडियो जानकारी',
    profileSub: 'ऑर्डर और पिकअप के लिए अपनी जानकारी प्रबंधित करें।',
    changePhoto: 'नई फोटो अपलोड करें',
    fullName: 'मास्टर दर्जी का नाम',
    emailAddress: 'ईमेल पता',
    phoneNumber: 'फ़ोन नंबर',
    pickupAddress: 'स्टुडियो पता',
    preferredStudio: 'स्टुडियो का नाम',
    saveProfileBtn: 'सहेजें',
    languageTitle: 'भाषा प्रणाली',
    centralizedLangTitle: 'केंद्रीयकृत भाषा प्राथमिकता',
    centralizedLangSub: 'पूरे स्टुडियो ऐप में भाषा तुरंत बदल जाती है।',
    langSelectLabel: 'भाषा चुनें',
    appearanceTitle: 'स्वरूप और थीम',
    colorTheme: 'रंग थीम',
    themeLight: 'लाइट थीम',
    themeDark: 'डार्क थीम',
    fontSizeLabel: 'फ़ॉन्ट का आकार',
    fontSmall: 'छोटा',
    fontMedium: 'सामान्य',
    fontLarge: 'बड़ा',
    highContrastTitle: 'उच्च कंट्रास्ट मोड',
    highContrastSub: 'कंट्रास्ट बढ़ाएं।',
    securityTitle: 'सुरक्षा',
    securitySub: 'सुरक्षा सुनिश्चित करें।',
    changePassHeading: 'पासवर्ड बदलें',
    currentPass: 'वर्तमान पासवर्ड',
    newPass: 'नया पासवर्ड',
    confirmPass: 'पुष्टि करें',
    passStrengthLabel: 'मजबूती',
    updatePassBtn: 'अपडेट करें',
    twoFactorTitle: '2FA प्रमाणीकरण',
    twoFactorSub: 'सुरक्षा परत जोड़ें।',
    twoFactorQR: 'QR स्कैन करें:',
    twoFactorEnabled: '2FA सक्रिय है',
    sessionsHeading: 'सक्रिय लॉगिन उपकरण',
    sessionsSub: 'सक्रिय उपकरण।',
    currentSessionBadge: 'वर्तमान उपकरण',
    logoutDevice: 'पहुंच हटाएं',
    logoutAllDevices: 'सभी से लॉग आउट करें',
    session1: 'Chrome on Windows 11',
    session2: 'WhatsApp Web',
    session3: 'iPhone 15 Pro',
    tailoringTitle: 'नाप और फिटिंग',
    tailoringSub: 'सुरक्षित नाप।',
    unitLabel: 'इकाई प्रणाली',
    inches: 'इंच (in)',
    centimeters: 'सेंटीमीटर (cm)',
    savedMeasurements: 'सुरक्षित नाप',
    chest: 'छाती',
    waist: 'कमर',
    hips: 'हिप्स',
    shoulder: 'कंधा',
    sleeve: 'आस्तीन',
    neck: 'गर्दन',
    fitPreference: 'फिटिंग शैली',
    fitSlim: 'स्लिम फिट',
    fitRegular: 'नियमित फिट',
    fitRelaxed: 'आरामदायक फिट',
    fabricCarePref: 'कपड़े की पूर्व-देखभाल',
    fabricCareSub: 'सिकोड़ने की अनुमति दें।',
    saveMeasurementsBtn: 'सहेजें',
    notificationsTitle: 'सूचनाएं',
    notificationsSub: 'अधिसूचना सेटिंग्स।',
    notifWhatsapp: 'व्हाट्सएप अपडेट',
    notifWhatsappSub: 'ग्राहक को फोटो भेजें।',
    notifSMS: 'एसएमएस अलर्ट',
    notifSMSSub: 'पिकअप अलर्ट।',
    notifTailorMsg: 'ग्राहक संदेश',
    notifTailorMsgSub: 'सीधे संदेश।',
    quietHoursTitle: 'शांत समय',
    quietHoursSub: 'सूचनाएं बंद रखें।',
    privacyTitle: 'गोपनीयता और डेटा',
    privacySub: 'डेटा नियंत्रण।',
    measurementPrivacy: 'नाप देखने दें',
    measurementPrivacySub: 'ग्राहक को नाप देखने की अनुमति दें।',
    exportDataTitle: 'प्रोफ़ाइल डाउनलोड करें',
    exportDataSub: 'JSON बैकअप लें।',
    exportBtn: 'डाउनलोड (JSON)',
    clearCacheTitle: 'कैश साफ़ करें',
    clearCacheSub: 'स्टोरेज खाली करें।',
    clearCacheBtn: 'कैश साफ़ करें',
    dangerZoneTitle: 'स्टुडियो खाता प्रबंधन',
    logoutAccount: 'लॉग आउट',
    deleteAccount: 'खाता हटाएं',
    logoutModalTitle: 'लॉग आउट करें?',
    logoutModalSub: 'डेटा सुरक्षित रहेगा।',
    cancelBtn: 'रद्द करें',
    confirmLogoutBtn: 'हाँ, लॉग आउट करें',
    deleteModalTitle: 'खाता हटाएं?',
    deleteModalSub: 'यह पूर्ववत नहीं किया जा सकता।',
    confirmDeleteBtn: 'खाता हटाएं'
  },
  ta: {
    brandName: 'THY மாஸ்டர் தையலகம்',
    subtitle: 'தையல்காரர் ஸ்டூடியோ அமைப்புகள்',
    toastSaveSuccess: 'அமைப்புகள் சேமிக்கப்பட்டன!',
    toastCacheCleared: 'தற்காலிக கோப்புகள் அழிக்கப்பட்டன.',
    toastDataExported: 'JSON கோப்பு பதிவிறக்கப்பட்டது.',
    toastPassUpdated: 'கடவுச்சொல் புதுப்பிக்கப்பட்டது!',
    toastSessionRevoked: 'சாதனம் நீக்கப்பட்டது!',
    tabProfile: 'சுயவிவரம்',
    tabLanguage: 'மொழி அமைப்புகள்',
    tabAppearance: 'தோற்றம்',
    tabSecurity: 'பாதுகாப்பு',
    tabTailoring: 'உடலளவுகள்',
    tabNotifications: 'அறிவிப்புகள்',
    tabPrivacy: 'தனியுரிமை',
    profileTitle: 'மாஸ்டர் தையல்காரர் விவரங்கள்',
    profileSub: 'ஸ்டூடியோ விவரங்களை நிர்வகிக்கவும்.',
    changePhoto: 'படம் பதிவேற்று',
    fullName: 'தையல்காரர் பெயர்',
    emailAddress: 'மின்னஞ்சல்',
    phoneNumber: 'தொலைபேசி எண்',
    pickupAddress: 'ஸ்டூடியோ முகவரி',
    preferredStudio: 'ஸ்டூடியோ பெயர்',
    saveProfileBtn: 'சேமி',
    languageTitle: 'மொழி முறைமை',
    centralizedLangTitle: 'மொழி விருப்பம்',
    centralizedLangSub: 'மொழியை மாற்றுங்கள்.',
    langSelectLabel: 'மொழியைத் தேர்வுசெய்க',
    appearanceTitle: 'தோற்றம்',
    colorTheme: 'வண்ண முறை',
    themeLight: 'வெளிர் தீம்',
    themeDark: 'கருமை தீம்',
    fontSizeLabel: 'எழுத்துரு அளவு',
    fontSmall: 'சிறியது',
    fontMedium: 'சாதாரண',
    fontLarge: 'பெரியது',
    highContrastTitle: 'மாறுபாடு முறை',
    highContrastSub: 'எழுத்துக்களை மேம்படுத்து.',
    securityTitle: 'பாதுகாப்பு',
    securitySub: 'பாதுகாப்பை உறுதிசெய்.',
    changePassHeading: 'கடவுச்சொல் மாற்று',
    currentPass: 'தற்போதைய கடவுச்சொல்',
    newPass: 'புதிய கடவுச்சொல்',
    confirmPass: 'உறுதிசெய்',
    passStrengthLabel: 'வலிமை',
    updatePassBtn: 'புதுப்பி',
    twoFactorTitle: '2FA அங்கீகாரம்',
    twoFactorSub: 'கூடுதல் பாதுகாப்பு.',
    twoFactorQR: 'QR குறியீட்டை ஸ்கேன் செய்:',
    twoFactorEnabled: '2FA செயல்படுகிறது',
    sessionsHeading: 'செயலில் உள்ள சாதனங்கள்',
    sessionsSub: 'சாதனங்கள்.',
    currentSessionBadge: 'தற்போதைய சாதனம்',
    logoutDevice: 'நீக்கு',
    logoutAllDevices: 'அனைத்திலிருந்தும் வெளியேறு',
    session1: 'Chrome on Windows 11',
    session2: 'WhatsApp Web',
    session3: 'iPhone 15 Pro',
    tailoringTitle: 'உடலளவுகள்',
    tailoringSub: 'சேமிக்கப்பட்ட அளவுகள்.',
    unitLabel: 'அளவீட்டு முறை',
    inches: 'அங்குலம் (in)',
    centimeters: 'சென்டிமீட்டர் (cm)',
    savedMeasurements: 'அளவுகள்',
    chest: 'மார்பளவு',
    waist: 'இடுப்பளவு',
    hips: 'இடுப்பு சுற்றளவு',
    shoulder: 'தோள்பட்டை',
    sleeve: 'கை நீளம்',
    neck: 'கழுத்து',
    fitPreference: 'தையல் பாணி',
    fitSlim: 'ஸ்லிம் ஃபிட்',
    fitRegular: 'சாதாரண ஃபிட்',
    fitRelaxed: 'தளர்த்தியான ஃபிட்',
    fabricCarePref: 'துணி பராமரிப்பு',
    fabricCareSub: 'சுருங்க அனுமதி.',
    saveMeasurementsBtn: 'அளவுகளை சேமி',
    notificationsTitle: 'அறிவிப்புகள்',
    notificationsSub: 'அறிவிப்பு அமைப்புகள்.',
    notifWhatsapp: 'வாட்ஸ்அப் நிலை',
    notifWhatsappSub: 'படங்கள் அனுப்பு.',
    notifSMS: 'SMS விழிப்பூட்டல்',
    notifSMSSub: 'குறுஞ்செய்தி பெறுக.',
    notifTailorMsg: 'வாடிக்கையாளர் செய்திகள்',
    notifTailorMsgSub: 'நேரடி அறிவிப்பு.',
    quietHoursTitle: 'அமைதி நேரம்',
    quietHoursSub: 'இரவில் அறிவிப்புகளை நிறுத்து.',
    privacyTitle: 'தனியுரிமை',
    privacySub: 'தரவு கட்டுப்பாடு.',
    measurementPrivacy: 'அளவுகளைப் பகிர்',
    measurementPrivacySub: 'வாடிக்கையாளர் பார்க்க அனுமதி.',
    exportDataTitle: 'பதிவிறக்கு',
    exportDataSub: 'JSON நகல்.',
    exportBtn: 'பதிவிறக்கு (JSON)',
    clearCacheTitle: 'கேச் அழி',
    clearCacheSub: 'சேமிப்பகத்தை காலியாக்கு.',
    clearCacheBtn: 'கேச் அழி',
    dangerZoneTitle: 'கணக்கு நடவடிக்கைகள்',
    logoutAccount: 'வெளியேறு',
    deleteAccount: 'கணக்கை நீக்கு',
    logoutModalTitle: 'வெளியேறவா?',
    logoutModalSub: 'தரவு பாதுகாப்பாக இருக்கும்.',
    cancelBtn: 'ரத்து செய்',
    confirmLogoutBtn: 'ஆம், வெளியேறு',
    deleteModalTitle: 'நீக்கவா?',
    deleteModalSub: 'மீட்க முடியாது.',
    confirmDeleteBtn: 'நிரந்தரமாக நீக்கு'
  }
};

const LanguageContext = createContext({
  lang: 'en',
  setLang: (lang: string) => {},
  t: (key: string) => key
});

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');
  const t = (key: string) => TRANSLATIONS[lang as keyof typeof TRANSLATIONS]?.[key as keyof typeof TRANSLATIONS['en']] || TRANSLATIONS['en'][key as keyof typeof TRANSLATIONS['en']] || key;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

function useLanguage() {
  return useContext(LanguageContext);
}

export default function TailorSettingsPageWrapper() {
  return (
    <LanguageProvider>
      <TailorSettingsPage />
    </LanguageProvider>
  );
}

function TailorSettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); 
  const [toastMessage, setToastMessage] = useState('');

  const [profile, setProfile] = useState({
    name: 'Priya S. (Master Cutter)',
    email: 'priya.tailors@example.com',
    phone: '+91 98401 23456',
    address: 'No. 12, Canal Bank Road, Adyar, Chennai, TN - 600020',
    studio: "Priya's Boutique & Custom Tailoring Atelier",
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  });

  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState([
    { id: 'sess-1', title: 'session1', ip: '157.48.201.99', current: true },
    { id: 'sess-2', title: 'session2', ip: '106.51.72.14', current: false },
    { id: 'sess-3', title: 'session3', ip: '182.73.189.4', current: false }
  ]);

  const [unit, setUnit] = useState('inches');
  const [fitStyle, setFitStyle] = useState('slim');
  const [fabricCare, setFabricCare] = useState(true);
  const [measurements, setMeasurements] = useState<Record<string, string>>({
    chest: '36.0',
    waist: '30.0',
    hips: '38.5',
    shoulder: '14.5',
    sleeve: '11.0',
    neck: '13.5'
  });

  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: true,
    tailorMsg: true,
    quietHours: false
  });

  const [shareMeasurements, setShareMeasurements] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const triggerToast = (msgKey: string) => {
    setToastMessage(t(msgKey));
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    triggerToast('toastSessionRevoked');
  };

  const getPassStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 10) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-thy-burgundy' };
  };
  const passStrength = getPassStrength(newPass);

  return (
    <div className={`min-h-dvh antialiased transition-colors duration-200 ${
      darkMode ? 'bg-[#3F1218] text-thy-cream' : 'bg-transparent text-thy-ink'
    } ${highContrast ? 'contrast-125' : ''}`}>
      
      {/* Top Bar */}
      <header className={`sticky top-0 z-40 border-b shadow-sm transition-colors ${
        darkMode ? 'bg-[#4A1520]/95 border-white/10 backdrop-blur-md' : 'bg-thy-canvas/90 border-thy-burgundy/15 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-thy-burgundy flex items-center justify-center text-white font-bold text-xl shadow-md shadow-thy-burgundy/30">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className={`text-xl sm:text-2xl font-bold tracking-tight block leading-none ${
                  darkMode ? 'text-white' : 'text-thy-ink'
                }`}>
                  {t('brandName')}
                </span>
                <span className="text-[10px] font-semibold text-thy-burgundy tracking-wider uppercase">
                  {t('subtitle')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <Globe className="w-4 h-4 text-thy-burgundy flex-shrink-0" />
                <select 
                  value={lang}
                  onChange={(e) => {
                    setLang(e.target.value);
                    triggerToast('toastSaveSuccess');
                  }}
                  className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-full border transition-all ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Tabs */}
          <div className={`lg:col-span-4 border rounded-3xl p-3 space-y-1.5 shadow-sm sticky top-28 ${
            darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'
          }`}>
            {[
              { key: 'profile', label: t('tabProfile'), icon: User },
              { key: 'language', label: t('tabLanguage'), icon: Languages },
              { key: 'appearance', label: t('tabAppearance'), icon: Sun },
              { key: 'security', label: t('tabSecurity'), icon: Shield },
              { key: 'tailoring', label: t('tabTailoring'), icon: Ruler },
              { key: 'notifications', label: t('tabNotifications'), icon: Bell },
              { key: 'privacy', label: t('tabPrivacy'), icon: Lock }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === item.key
                      ? 'bg-thy-burgundy text-white shadow-md shadow-thy-burgundy/20'
                      : darkMode ? 'text-slate-300 hover:bg-slate-800/80' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-60 ${activeTab === item.key ? 'text-white' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Profile */}
            {activeTab === 'profile' && (
              <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'}`}>
                <h2 className={`text-lg font-bold border-b pb-4 flex items-center gap-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
                  <User className="w-5 h-5 text-thy-burgundy" />
                  {t('profileTitle')}
                </h2>
                <p className="text-xs text-slate-400">{t('profileSub')}</p>

                <div className="flex items-center gap-5">
                  <div className="relative group cursor-pointer">
                    <img src={profile.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-thy-burgundy/30 shadow-md" />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <button onClick={() => triggerToast('toastSaveSuccess')} className="px-4 py-2 border border-thy-burgundy text-thy-burgundy hover:bg-thy-burgundy hover:text-white rounded-xl text-xs font-bold transition-all">
                      {t('changePhoto')}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1">Allowed JPG, PNG or WEBP (Max 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold block mb-1.5">{t('fullName')}</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1.5">{t('emailAddress')}</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1.5">{t('phoneNumber')}</label>
                    <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1.5">{t('preferredStudio')}</label>
                    <input type="text" value={profile.studio} onChange={(e) => setProfile({ ...profile, studio: e.target.value })} className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold block mb-1.5">{t('pickupAddress')}</label>
                    <textarea rows={2} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                  </div>
                </div>

                <button onClick={() => triggerToast('toastSaveSuccess')} className="px-6 py-3 bg-thy-burgundy hover:bg-[#4A1520] text-white font-bold text-xs rounded-xl shadow-md transition-all">
                  {t('saveProfileBtn')}
                </button>
              </div>
            )}

            {/* 2. Language */}
            {activeTab === 'language' && (
              <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'}`}>
                <h2 className={`text-lg font-bold border-b pb-4 flex items-center gap-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
                  <Languages className="w-5 h-5 text-thy-burgundy" />
                  {t('languageTitle')}
                </h2>
                <div className={`p-5 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-thy-mist/60 border-thy-mist'}`}>
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-thy-burgundy" />
                    <div>
                      <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('centralizedLangTitle')}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{t('centralizedLangSub')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { code: 'en', label: 'English (US/UK)' },
                      { code: 'hi', label: 'हिंदी (Hindi)' },
                      { code: 'ta', label: 'தமிழ் (Tamil)' }
                    ].map((l) => (
                      <button key={l.code} onClick={() => { setLang(l.code); triggerToast('toastSaveSuccess'); }} className={`p-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${lang === l.code ? 'bg-thy-burgundy text-white border-thy-burgundy shadow-md' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                        <span>{l.label}</span>
                        {lang === l.code && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Appearance */}
            {activeTab === 'appearance' && (
              <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'}`}>
                <h2 className={`text-lg font-bold border-b pb-4 flex items-center gap-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
                  <Sun className="w-5 h-5 text-thy-burgundy" />
                  {t('appearanceTitle')}
                </h2>
                <div className="space-y-3">
                  <label className={`text-xs font-bold block ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t('colorTheme')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setDarkMode(false)} className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${!darkMode ? 'bg-thy-mist border-thy-burgundy text-thy-ink font-bold shadow-md' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                      <Sun className="w-5 h-5 text-amber-500" />
                      <span className="text-xs">{t('themeLight')}</span>
                    </button>
                    <button onClick={() => setDarkMode(true)} className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${darkMode ? 'bg-[#3F1218] border-thy-burgundy text-thy-cream font-bold shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      <Moon className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs">{t('themeDark')}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className={`text-xs font-bold block ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t('fontSizeLabel')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ key: 'small', label: t('fontSmall') }, { key: 'medium', label: t('fontMedium') }, { key: 'large', label: t('fontLarge') }].map((f) => (
                      <button key={f.key} onClick={() => setFontSize(f.key)} className={`p-3 rounded-xl border text-xs font-bold transition-all ${fontSize === f.key ? 'bg-thy-burgundy text-white border-thy-burgundy' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <h4 className="text-xs font-bold">{t('highContrastTitle')}</h4>
                    <p className="text-[11px] text-slate-400">{t('highContrastSub')}</p>
                  </div>
                  <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} className="w-5 h-5 accent-thy-burgundy cursor-pointer" />
                </div>
              </div>
            )}

            {/* 4. Security */}
            {activeTab === 'security' && (
              <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'}`}>
                <h2 className={`text-lg font-bold border-b pb-4 flex items-center gap-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
                  <Shield className="w-5 h-5 text-thy-burgundy" />
                  {t('securityTitle')}
                </h2>
                <p className="text-xs text-slate-400">{t('securitySub')}</p>

                <div className="space-y-4 max-w-md">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-thy-burgundy">{t('changePassHeading')}</h3>
                  <div>
                    <label className="text-xs font-semibold block mb-1">{t('currentPass')}</label>
                    <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-xs ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">{t('newPass')}</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={newPass} onChange={(e) => setNewPass(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-xs ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPass && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span>{t('passStrengthLabel')}</span>
                          <span className="text-thy-burgundy">{passStrength.label}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${passStrength.color}`} style={{ width: `${(passStrength.score / 3) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">{t('confirmPass')}</label>
                    <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-xs ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`} />
                  </div>
                  <button onClick={() => { triggerToast('toastPassUpdated'); setCurrentPass(''); setNewPass(''); setConfirmPass(''); }} className="px-6 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all">
                    {t('updatePassBtn')}
                  </button>
                </div>

                <div className={`border-t pt-6 space-y-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('twoFactorTitle')}</h3>
                      <p className="text-xs text-slate-400">{t('twoFactorSub')}</p>
                    </div>
                    <input type="checkbox" checked={twoFactorEnabled} onChange={(e) => setTwoFactorEnabled(e.target.checked)} className="w-5 h-5 accent-thy-burgundy cursor-pointer" />
                  </div>
                  {twoFactorEnabled && (
                    <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-thy-mist/50 border-thy-mist'}`}>
                      <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center border shadow-sm">
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h2v2h-2v-2zm-4 0h2v4h-2v-4zm2 4h4v2h-4v-2zm2 2h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-thy-burgundy uppercase tracking-wider block">{t('twoFactorEnabled')}</span>
                        <p className="text-xs text-slate-400 mt-1">{t('twoFactorQR')}</p>
                        <code className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded mt-2 inline-block font-bold">THY-AUTHY-9921-X8</code>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`border-t pt-6 space-y-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('sessionsHeading')}</h3>
                      <p className="text-xs text-slate-400">{t('sessionsSub')}</p>
                    </div>
                    {sessions.length > 1 && (
                      <button onClick={() => { setSessions(sessions.filter(s => s.current)); triggerToast('toastSessionRevoked'); }} className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all text-left">
                        {t('logoutAllDevices')}
                      </button>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    {sessions.map((sess) => (
                      <div key={sess.id} className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-thy-mist0/10 text-thy-burgundy">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t(sess.title)}</h4>
                            <p className="text-[10px] text-slate-400">IP: {sess.ip}</p>
                          </div>
                        </div>
                        {sess.current ? (
                          <span className="text-[10px] font-extrabold text-thy-burgundy bg-thy-burgundy/10 px-2.5 py-0.5 rounded-full border border-thy-burgundy/20">{t('currentSessionBadge')}</span>
                        ) : (
                          <button onClick={() => handleRevokeSession(sess.id)} className="text-xs font-bold text-rose-500 hover:underline">{t('logoutDevice')}</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Tailoring */}
            {activeTab === 'tailoring' && (
              <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'}`}>
                <h2 className={`text-lg font-bold border-b pb-4 flex items-center gap-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
                  <Ruler className="w-5 h-5 text-thy-burgundy" />
                  {t('tailoringTitle')}
                </h2>
                <p className="text-xs text-slate-400">{t('tailoringSub')}</p>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400">{t('unitLabel')}:</span>
                  <div className={`flex rounded-xl p-1 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                    <button onClick={() => setUnit('inches')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${unit === 'inches' ? 'bg-thy-burgundy text-white shadow' : 'text-slate-500'}`}>{t('inches')}</button>
                    <button onClick={() => setUnit('cm')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${unit === 'cm' ? 'bg-thy-burgundy text-white shadow' : 'text-slate-500'}`}>{t('centimeters')}</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-thy-burgundy">{t('savedMeasurements')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.keys(measurements).map((mKey) => (
                      <div key={mKey} className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">{t(mKey) || mKey}</label>
                        <div className="flex items-center gap-1">
                          <input type="text" value={measurements[mKey]} onChange={(e) => setMeasurements({ ...measurements, [mKey]: e.target.value })} className={`w-full bg-transparent text-sm font-extrabold focus:outline-none ${darkMode ? 'text-thy-cream' : 'text-thy-burgundy'}`} />
                          <span className="text-[10px] text-slate-400 font-bold">{unit === 'inches' ? 'in' : 'cm'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold block">{t('fitPreference')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[{ key: 'slim', label: t('fitSlim') }, { key: 'regular', label: t('fitRegular') }, { key: 'relaxed', label: t('fitRelaxed') }].map((f) => (
                      <button key={f.key} onClick={() => setFitStyle(f.key)} className={`p-3.5 rounded-2xl border text-xs font-bold transition-all ${fitStyle === f.key ? 'bg-thy-burgundy text-white border-thy-burgundy shadow' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <h4 className="text-xs font-bold">{t('fabricCarePref')}</h4>
                    <p className="text-[11px] text-slate-400">{t('fabricCareSub')}</p>
                  </div>
                  <input type="checkbox" checked={fabricCare} onChange={(e) => setFabricCare(e.target.checked)} className="w-5 h-5 accent-thy-burgundy cursor-pointer" />
                </div>

                <button onClick={() => triggerToast('toastSaveSuccess')} className="px-6 py-3 bg-thy-burgundy hover:bg-[#4A1520] text-white font-bold text-xs rounded-xl shadow-md transition-all">
                  {t('saveMeasurementsBtn')}
                </button>
              </div>
            )}

            {/* 6. Notifications */}
            {activeTab === 'notifications' && (
              <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'}`}>
                <h2 className={`text-lg font-bold border-b pb-4 flex items-center gap-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
                  <Bell className="w-5 h-5 text-thy-burgundy" />
                  {t('notificationsTitle')}
                </h2>
                <p className="text-xs text-slate-400">{t('notificationsSub')}</p>

                <div className="space-y-4">
                  {[
                    { key: 'whatsapp', title: t('notifWhatsapp'), sub: t('notifWhatsappSub') },
                    { key: 'sms', title: t('notifSMS'), sub: t('notifSMSSub') },
                    { key: 'tailorMsg', title: t('notifTailorMsg'), sub: t('notifTailorMsgSub') },
                    { key: 'quietHours', title: t('quietHoursTitle'), sub: t('quietHoursSub') }
                  ].map((item) => (
                    <div key={item.key} className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                        <h4 className="text-xs font-bold">{item.title}</h4>
                        <p className="text-[11px] text-slate-400">{item.sub}</p>
                      </div>
                      <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]} onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })} className="w-5 h-5 accent-thy-burgundy cursor-pointer" />
                    </div>
                  ))}
                </div>

                <button onClick={() => triggerToast('toastSaveSuccess')} className="px-6 py-3 bg-thy-burgundy hover:bg-[#4A1520] text-white font-bold text-xs rounded-xl shadow-md transition-all">
                  {t('saveProfileBtn')}
                </button>
              </div>
            )}

            {/* 7. Privacy */}
            {activeTab === 'privacy' && (
              <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${darkMode ? 'bg-[#4A1520] border-white/10' : 'bg-thy-canvas/90 border-thy-burgundy/15'}`}>
                <h2 className={`text-lg font-bold border-b pb-4 flex items-center gap-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
                  <Lock className="w-5 h-5 text-thy-burgundy" />
                  {t('privacyTitle')}
                </h2>

                <div className="space-y-5">
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <h4 className="text-xs font-bold">{t('measurementPrivacy')}</h4>
                      <p className="text-[11px] text-slate-400">{t('measurementPrivacySub')}</p>
                    </div>
                    <input type="checkbox" checked={shareMeasurements} onChange={(e) => setShareMeasurements(e.target.checked)} className="w-5 h-5 accent-thy-burgundy cursor-pointer" />
                  </div>

                  <div className={`p-5 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <h4 className="text-xs font-bold">{t('exportDataTitle')}</h4>
                      <p className="text-[11px] text-slate-400">{t('exportDataSub')}</p>
                    </div>
                    <button onClick={() => triggerToast('toastDataExported')} className="px-4 py-2 border border-thy-burgundy text-thy-burgundy hover:bg-thy-burgundy hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                      <Download className="w-4 h-4" />
                      <span>{t('exportBtn')}</span>
                    </button>
                  </div>

                  <div className={`p-5 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <h4 className="text-xs font-bold">{t('clearCacheTitle')}</h4>
                      <p className="text-[11px] text-slate-400">{t('clearCacheSub')}</p>
                    </div>
                    <button onClick={() => triggerToast('toastCacheCleared')} className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4" />
                      <span>{t('clearCacheBtn')}</span>
                    </button>
                  </div>

                  <div className={`border-t pt-6 space-y-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">{t('dangerZoneTitle')}</h4>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setShowLogoutModal(true)} className="px-5 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5">
                        <LogOut className="w-4 h-4" />
                        <span>{t('logoutAccount')}</span>
                      </button>

                      <button onClick={() => setShowDeleteModal(true)} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                        <Trash2 className="w-4 h-4" />
                        <span>{t('deleteAccount')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900 text-white border border-thy-burgundy px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-thy-cream" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="text-base font-bold">{t('logoutModalTitle')}</h3>
            <p className="text-xs text-slate-400">{t('logoutModalSub')}</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setShowLogoutModal(false)} className="py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700">
                {t('cancelBtn')}
              </button>
              <button onClick={() => { setShowLogoutModal(false); triggerToast('toastSaveSuccess'); }} className="py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700">
                {t('confirmLogoutBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="text-base font-bold">{t('deleteModalTitle')}</h3>
            <p className="text-xs text-slate-400">{t('deleteModalSub')}</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700">
                {t('cancelBtn')}
              </button>
              <button onClick={() => { setShowDeleteModal(false); triggerToast('toastSaveSuccess'); }} className="py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700">
                {t('confirmDeleteBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}