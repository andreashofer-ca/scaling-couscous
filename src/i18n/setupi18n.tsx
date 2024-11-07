import { registerI18nLoader } from '@ui5/webcomponents-base/dist/asset-registries/i18n.js'
import i18n, { use } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { i18nextPlugin } from 'translation-check'
import { setLanguage } from '@ui5/webcomponents-base/dist/config/Language'
import deTranslations from 'i18n/locales/de/translations.json'
import ui5DeTranslations from 'i18n/locales/de/ui5-translations.json'
import enTranslations from 'i18n/locales/en/translations.json'
import ui5EnTranslations from 'i18n/locales/en/ui5-translations.json'

/**
 * Supported Languages Configuration
 *
 * Defines the supported languages for the application with their corresponding translations, codes, and names.
 *
 * @constant
 * @name SUPPORTED_LANGUAGES
 * @type {Object}
 */
export const SUPPORTED_LANGUAGES = {
  'en-US': {
    translation: enTranslations,
    code: 'en-US',
    name: 'English (US)',
  },
  'en-GB': {
    translation: enTranslations,
    code: 'en-GB',
    name: 'English (GB)',
  },
  de: {
    translation: deTranslations,
    code: 'de-DE',
    name: 'Deutsch',
  },
}

export const getSupportedLanguages = () =>
  Object.values(SUPPORTED_LANGUAGES).map((language) => language.code)

// replace ui5 internal translations
registerI18nLoader('@ui5/webcomponents-react', 'de-DE', async () =>
  Promise.resolve(ui5DeTranslations),
)
registerI18nLoader('@ui5/webcomponents-react', 'en-US', async () =>
  Promise.resolve(ui5EnTranslations),
)
registerI18nLoader('@ui5/webcomponents-react', 'en-GB', async () =>
  Promise.resolve(ui5EnTranslations),
)

// HINT: import translation-check plugin during development
if (import.meta.env.DEV) use(i18nextPlugin)
void use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      debug: false,
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
      resources: SUPPORTED_LANGUAGES,
      react: {
        useSuspense: false,
      },
      fallbackLng: 'en-US',
    },
    () => {
      void setLanguage(i18n.language)
    },
  )
