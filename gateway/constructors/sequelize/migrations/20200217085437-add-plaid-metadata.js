'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      {
        tableName: 'StripeSources',
        schema: 'gateway',
      },
      'metadata',
      {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'StripeSources',
        schema: 'gateway',
      },
      'metadata'
    )
  },
}
