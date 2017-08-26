const conn = require('./conn');

const LineItem = conn.define('lineitem', {
  quantity: {
    type: conn.Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
});

LineItem.prototype.addOne = function () {
  return this.update({
    quantity: this.quantity++
  })
};

module.exports = LineItem;
