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
    quantity: ++this.quantity
  })
};

LineItem.createOne = function(order, product) {
  // must have associations
  return LineItem.create()
  .then(lineitem=> {
    return lineitem.setOrder(order);
  }).then(lineitem=> {
    return lineitem.setProduct(product);
  })
}

LineItem.lineExists = function(orderId, productId) {
  return LineItem.findOne({ where: { orderId, productId }});
}

module.exports = LineItem;
