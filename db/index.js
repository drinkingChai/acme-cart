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
LineItem.belongsTo(Order);
Order.hasMany(LineItem);


// updateFromRequestBody
// addProductToCart
// destroyLineItem
Order.updateFromRequestBody = function(orderId, data) {

}

Order.addProductToCart = function(productId) {
  // findOrCreate not working in pg@7 :/
  // return Order.findOrCreate({
  //   where: { isCart: false },
  //   defaults: {}
  // }).spread((order, created)=> {
  //   return order;
  // })
  let curOrder, curLI, curProduct;
  return Product.findOne({
    where: { id: productId }
  }).then(foundProduct=> {
    if (!foundProduct) throw new Error('product not found');
    curProduct = foundProduct;
    return Order.findOne({
      where: { isCart: true }
    })
  }).then(foundCart=> {
    if (foundCart) return foundCart;
    return Order.create({})
  }).then(order=> {
    curOrder = order;
    return LineItem.findOne({
      where: {
        productId,
        orderId: order.id
      }
    })
  }).then(foundLI=> {
    if (foundLI) return foundLI.addOne();
    return LineItem.create({});
  }).then(lineItem=> {
    curLI = lineItem;
    return Promise.all([
      lineItem.setOrder(curOrder),
      lineItem.setProduct(curProduct)
    ])
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
