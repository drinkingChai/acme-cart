const db = require('./db');
const Order = db.models.Order;
const Product = db.models.Product;

const seed = function() {
  let p1, p2, p3;
  return Promise.all([
    Product.create({ name: 'Torta con tinga' }),
    Product.create({ name: 'Quesadilla con carne picada' }),
    Product.create({ name: 'Tacos con pollo' }),
    Product.create({ name: 'Horchata' }),
    Product.create({ name: 'Agua Fresca' })
  ])
  // return Order.addProductToCart()
}

module.exports = seed;