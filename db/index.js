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
Order.hasMany(LineItem);

// helpers

//
Order.updateFromRequestBody = function(orderId, data) {
  return Order.findOne({ where: { id: orderId }})
  .then(order=> order.finalize(data));
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
  }).then(lineitem=> {
    return lineitem.addOne();
  })
}

Order.destroyLineItem = function(orderId, lineItemId) {
  let cart;
  return LineItem.findOne({
    where: { id: lineItemId, orderId }
  }).then(lineitem=> {
    return lineitem.destroy();
  }).then(()=> {
    return Order.findOne({ where: { id: orderId }})
  }).then(order=> {
    cart = order;
    return order.getLineitems();
  }).then(items=> {
    if (!items.length) return cart.destroy();
    return cart;
  })
}




module.exports = {
  sync,
  models: {
    Product,
    LineItem,
    Order
  }
}
