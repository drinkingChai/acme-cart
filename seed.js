const db = require('./db');
const Order = db.models.Order;
const Product = db.models.Product;

const seed = function() {
  let p1, p2, p3;
  return Promise.all([
    Product.create({ name: 'Torta' }),
    Product.create({ name: 'Quesadilla' }),
    Product.create({ name: 'Tamales' }),
    Product.create({ name: 'Pasteles' }),
    Product.create({ name: 'Helados' }),
    Product.create({ name: 'Tacos' }),
    Product.create({ name: 'Horchata' }),
    Product.create({ name: 'Agua Fresca' })
  ])
  // return Order.addProductToCart()
}

module.exports = seed;