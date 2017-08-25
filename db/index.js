const conn = require('./conn');

const sync = ()=> {
  return conn.sync({ force: true });
}

module.exports = {
  sync
}