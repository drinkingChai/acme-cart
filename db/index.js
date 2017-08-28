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

//
Order.updateFromRequestBody = function(orderId, data) {
  if (!data || !data.address || !data.address.trim().length) throw new Error('address required');
  return Order.findOne({ where: { id: orderId }})
  .then(order=> order.finalize(data.address));
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

Order.getViewModel = function() {
  let orders;
  return Order.findAll({
    include: [
      { model: LineItem,
        include: [ { model: Product } ]
      }
    ]
  }).then(allOrders=> {
    orders = allOrders;
    return Product.findAll()
  }).then(products=> {
    let cart = orders.filter(o=> o.isCart)[0];
    orders = orders.filter(o=> !o.isCart);
    return { cart, orders, products }
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
