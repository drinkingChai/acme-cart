const conn = require('./conn');
const Product = require('./Product');
const LineItem = require('./LineItem');
const Order = require('./Order');

const sync = ()=> {
  return conn.sync({ force: true });
}

// associations
// line items reference the product
// when adding a new product, run find create on line items
// line items belong to order
// order can have many line items
LineItem.belongsTo(Product);
Product.hasMany(LineItem);  // ex. to see how many orders of this was placed
LineItem.belongsTo(Order);
Order.hasMany(LineItem); // ex. how many items in cart


Order.updateFromRequestBody = function(orderId, data) {
  return Order.findOne({ where: { id: orderId }})
  .then(order=> {
    return order.placeOrder(data);
  })
}

Order.addProductToCart = function(productId) {
  /*
    1. find the product by Id
    2. find the order cart, if not, create one
    3. find lineitem matching order, if not, create lineitem and associate?
    4. increment
  */

  return Product.findOne({ where: { id: productId }})
  .then(product=> {
    if (!product) throw new Error('unknown product');

    return Order.findOrCreate({
      where: { isCart: true },
      defaults: {},
      include: {
        model: LineItem,
        // putting a where: { productId } if it doesn't exist, goes to error! "cannot get 0 of undefined"
      }
    })
  }).spread((order, created)=> {
    let liExists = order.lineitems.filter(li=> li.productId == productId);

    if (!liExists.length) return LineItem.create({
      productId,
      quantity: 1,
      orderId: order.id
    })
    return liExists[0].addOne();
  })
}

Order.destroyLineItem = function(orderId, lineItemId) {
  return Order.findOne({
    where: { id: orderId },
    include: {
      model: LineItem,
      where: { id: lineItemId }
    }
  })
  .then(order=> {
    if (order) return order.lineitems[0].destroy();
  })
  .then(()=> {
    return Order.findOne({
      where: { id: orderId },
      include: { model: LineItem }
    })
  }).then(order=> {
    if (!order.lineitems.length) return order.destroy();
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
