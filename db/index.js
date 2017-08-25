const conn = require('./conn');
const Product = require('./Product');
const LineItem = require('./LineItem');
const Order = require('./Order');

const sync = ()=> {
  return conn.sync({ force: true });
}

module.exports = {
  sync,
  models: {
    Product,
    LineItem,
    Order
  }
}