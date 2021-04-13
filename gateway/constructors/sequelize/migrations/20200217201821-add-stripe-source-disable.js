'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      {
        tableName: 'StripeSources',
        schema: 'gateway',
      },
      'disabled',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'StripeSources',
        schema: 'gateway',
      },
      'disabled'
    )
  },
}
