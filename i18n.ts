import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ko from './locales/ko.json';
import mn from './locales/mn.json';
import th from './locales/th.json';
import tl from './locales/tl.json';
import uz from './locales/uz.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';

const locale = Localization.getLocales()?.[0]?.languageCode ?? 'ko';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: {
            ko: { translation: ko },
            en: { translation: en },
            zh: { translation: zh },
            vi: { translation: vi },
            th: { translation: th },
            uz: { translation: uz },
            mn: { translation: mn },
            tl: { translation: tl },
        },
        lng: locale,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
