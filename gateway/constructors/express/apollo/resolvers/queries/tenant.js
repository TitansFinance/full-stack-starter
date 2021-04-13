module.exports = async (_, $, { req, session, models, user, pubsub }, ast) => {
  try {
    return {
      id: 1,
      name: 'Tenant',
      domains: ['www.tenant.url'],
      branding: {
        brandingIconUrl: 'http://icon.branding.url',
        logoUrl: 'http://logo.branding.url',
        faviconUrl: 'http://icon.branding.url',
        colorPrimary: '#000000',
        fontColorPrimary: '#ffffff',
        colorSecondary: '#888888',
        fontColorSecondary: '#ffffff',
        colorTertiary: '#dddddd',
        fontColorTertiary: '#000000',
      },
      authRequireMFA: false,
      authRequireEmail: true,
      authRequirePhone: false,
      authMfaEnabled: false,
      authPrimaryIdentifier: 'email',
    }
  } catch (error) {
    console.error(`errors.${__filename}`, error)
    return null
  }
}

