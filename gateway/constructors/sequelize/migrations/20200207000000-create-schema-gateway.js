module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createSchema('gateway')
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropSchema('gateway')
  },
}
