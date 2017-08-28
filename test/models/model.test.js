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
    it('finds cart or creates a new cart', ()=> {
      return Order.findCart()
      .then(cart=> {
        expect(cart).to.be.ok;
        return LineItem.findAll({ where: { orderId: cart.id }})
      }).then(lineitems=> {
        expect(lineitems.length).to.equal(0);
      })
    });
  })

  xdescribe('LineItem', ()=> {
  })

  describe('Product and Cart', ()=> {
    it('adds a product to cart', ()=> {
      return Order.addProductToCart(foo.id)
      .then(lineitem=> {
        expect(lineitem.productId).to.equal(foo.id);
        expect(lineitem.productId).to.not.equal(bar.id);
        expect(lineitem.orderId).to.equal(1);
      })
    })
  })

})
