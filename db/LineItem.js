const conn = require('./conn');

const LineItem = conn.define('lineitem', {
  quantity: {
    type: conn.Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
});

module.exports = LineItem;