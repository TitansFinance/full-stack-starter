const NextI18Next = require('next-i18next').default

const nextI18nOptions = {
  defaultLanguage: 'zh',
  otherLanguages: ['en'],
}

const nexti18n = new NextI18Next({
  ...nextI18nOptions,
  languages: [nextI18nOptions.defaultLanguage, ...nextI18nOptions.otherLanguages],
})

nexti18n.i18n.language = 'zh'

module.exports = nexti18n

