'use client'

// i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import koTranslation from '@/assets/locales/ko/ko.json'
import enTranslation from '@/assets/locales/en/en.json'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    ko: { translation: koTranslation },
    en: { translation: enTranslation },
}

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['ko', 'en'],
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

export default i18n
