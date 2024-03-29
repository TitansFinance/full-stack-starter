import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const loadPath = (process.env.GATEWAY_URL || window.location.origin) + '/static/locales/{{lng}}/{{ns}}.json'
console.log('\n\n')
console.log('process.env.PORT', process.env.PORT)
console.log('process.env.GATEWAY_URL', process.env.GATEWAY_URL)
console.log('process.env.GATEWAY_HOST', process.env.GATEWAY_HOST)
console.log('process.env.GATEWAY_PORT', process.env.GATEWAY_PORT)
console.log('\n\n')
console.log('loadPath', loadPath)

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: false, // process.env.NODE_ENV !== 'production',
    backend: {
      // for all available options read the backend's repository readme file
      loadPath,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
