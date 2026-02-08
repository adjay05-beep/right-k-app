import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';

// Basic configuration for i18n
i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3', // Required for Android
        resources: {
            ko: { translation: ko },
        },
        lng: Localization.getLocales()[0].languageCode ?? 'ko',
        fallbackLng: 'ko',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
