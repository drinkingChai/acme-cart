const expect = require('chai').expect;
const db = require('../../db');
const Product = db.models.Product;
const LineItem = db.models.LineItem;
const Order = db.models.Order;


describe('Models', ()=> {

  let foo, bar, baz,
    address = `123 awesome place, NY 12045`;
  beforeEach(()=> {
    return db.sync()
    .then(()=> {
      return Promise.all([
        Product.create({ name: 'Foo' }),
        Product.create({ name: 'Bar' }),
        Product.create({ name: 'Baz' })
      ]).then(([p1, p2, p3])=> {
        foo = p1;
        bar = p2;
        baz = p3;
      });
    })
  })

  describe('Order', ()=> {
    it('creates a new cart', ()=> {
    });

    xit(`returns error 'address required' if there's no address`, ()=> {
    })

    xit('places an order with an address', ()=> {
    })

    xit('destroys cart without any items', ()=> {
    });
  })

  xdescribe('LineItem', ()=> {
    it('throws error if product doesnt exist', ()=> {
    })

    it('adds a new line to cart', ()=> {
    })

    it('adds to existing line in cart', ()=> {
    })

    it('deletes an item from cart', ()=> {
    })
  })

})
