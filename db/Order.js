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

Order.prototype.finalize = function (address) {
  return this.update({
    isCart: false,
    address
  });
};

Order.findCart = function() {
  return Order.findOne({ where: { isCart: true }})
  .then(found=> {
    if (found) return found;
    return Order.create();
  })
}


module.exports = Order;
