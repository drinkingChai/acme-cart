const conn = require('./conn');
const Product = require('./Product');
const LineItem = require('./LineItem');
const Order = require('./Order');

const sync = ()=> {
  return conn.sync({ force: true });
}

// associations
LineItem.belongsTo(Product);
LineItem.belongsTo(Order);

// helpers

//
Order.updateFromRequestBody = function(orderId, data) {
}

Order.addProductToCart = function(productId) {
}

Order.destroyLineItem = function(orderId, lineItemId) {
}




module.exports = {
  sync,
  models: {
    Product,
    LineItem,
    Order
  }
}
