module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      phoneCountryCode: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isPhoneVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      language: {
        type: Sequelize.ENUM({
          values: ['en', 'zh'],
        }),
        defaultValue: 'en',
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM({
          values: ['USD', 'CNY'],
        }),
        defaultValue: 'USD',
        allowNull: false,
      },
      settings: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM({
          values: ['admin', 'user'],
        }),
        defaultValue: 'user',
      },
      consumerType: {
        type: Sequelize.ENUM({
          values: ['individual', 'business'],
        }),
        defaultValue: 'individual',
        allowNull: false,
      },
      sex: {
        type: Sequelize.ENUM({
          values: ['man', 'woman'],
        }),
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM({
          values: [
            'cis-male',
            'cis-female',
            'gay-male',
            'gay-female',
            'transgender-male',
            'transgender-female',
            'other',
          ],
        }),
        allowNull: true,
      },
      primaryAddressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      accountId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }, {
      schema: 'gateway',
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users', { schema: 'gateway' })
  },
}
