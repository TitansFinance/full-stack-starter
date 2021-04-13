'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      {
        tableName: 'StripeSources',
        schema: 'gateway',
      },
      'isDefault',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'StripeSources',
        schema: 'gateway',
      },
      'isDefault'
    )
  },
}
