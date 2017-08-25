const conn = require('./conn');

const Order = conn.define('order', {
  isCart: {
    type: conn.Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false 
  },
  address: {
    type: conn.Sequelize.STRING,
    set(val) {
      this.setDataValue('isCart', false);
      this.setDataValue('address', val);
    }
  }
})

module.exports = Order;