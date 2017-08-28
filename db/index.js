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
  let cart, product;
  return Promise.all([
    Order.findCart(),
    Product.findOne({ where: { id: productId }})
  ]).then(([foundOrder, foundProduct])=> {
    cart = foundOrder;
    product = foundProduct;
    return LineItem.lineExists(cart.id, productId);
  }).then(lineitem=> {
    if (lineitem) return lineitem;
    return LineItem.createOne(cart, product);
  })
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
