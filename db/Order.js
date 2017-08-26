const conn = require('./conn');

const Order = conn.define('order', {
  isCart: {
    type: conn.Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  address: {
    type: conn.Sequelize.STRING
  }
})

Order.prototype.placeOrder = function (address) {
  if (!address || !address.trim().length) throw new Error('address required');
  return this.update({
    isCart: false,
    address
  });
};


module.exports = Order;
