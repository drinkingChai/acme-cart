const expect = require('chai').expect;
const db = require('../../db');
const Product = db.models.Product;
const LineItem = db.models.LineItem;
const Order = db.models.Order;


describe('Models', ()=> {

  let foo, bar, baz, line1, line2, cart1,
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
        return Promise.all([
          LineItem.create({ productId: foo.id, quantity: 1 }),
          LineItem.create({ productId: bar.id, quantity: 1 })
        ])
      }).then(([l1, l2])=> {
        line1 = l1;
        line2 = l2;
        return Order.create({});
      }).then(order=> {
        cart1 = order;
        return Promise.all([
          line1.setOrder(order),
          line2.setOrder(order)
        ])
      })
    })
  })

  describe('exist', ()=> {
    it('Product', ()=> {
      expect(Product).to.be.ok;
    })

    it('LineItem', ()=> {
      expect(Product).to.be.ok;
    })

    it('Order', ()=> {
      expect(Product).to.be.ok;
    })
  })

  describe('update Order', ()=> {
    it('destroys cart without any items', ()=> {
      return Order.addProductToCart(baz.id)
      .then(()=> {
        return Promise.all([
          Order.destroyLineItem(cart1.id, foo.id),
          Order.destroyLineItem(cart1.id, bar.id),
          Order.destroyLineItem(cart1.id, baz.id)
        ])
      }).then(()=> {
        return Order.findOne({ where: { id: cart1.id }})
      }).then(order=> {
        expect(order).to.be.null;
        return LineItem.findAll();
      }).then(lineitems=> {
        expect(lineitems.length).to.equal(0);
      })
    });
  })

  describe('update LineItem', ()=> {
    it('throws error if product doesnt exist', ()=> {
      return Order.addProductToCart(65)
      .then(lineItem=> {
        expect(lineItem).to.be.null;
      })
      .catch(err=> {
        expect(err.message).to.equal('unknown product');
      });
    })

    it('adds a new line to cart', ()=> {
      return Order.addProductToCart(baz.id)
      .then(lineItem=> {
        expect(lineItem.orderId).to.equal(cart1.id);
        expect(lineItem.productId).to.equal(baz.id);
        expect(lineItem.quantity).to.equal(1);
      })
    })

    it('adds to existing line in cart', ()=> {
      return Order.addProductToCart(foo.id)
      .then(lineItem=> {
        expect(lineItem.orderId).to.equal(cart1.id);
        expect(lineItem.productId).to.equal(foo.id);
        expect(lineItem.quantity).to.equal(2);
        expect(lineItem.quantity).to.not.equal(1);
      })
    })

    it('deletes an item from cart', ()=> {
      return Order.destroyLineItem(cart1.id, foo.id)
      .then(()=> {
        return cart1.getLineitems();
      }).then(lineitems=> {
        let itemIds = lineitems.map(l=> l.id);
        expect(itemIds).to.not.include(foo.id);
      })
    })

    xit('tests', ()=> {
      console.log('line getProduct', line1.getProduct);
      console.log('product getLineItems', foo.getLineitems); // NOTE: camel case ignored
      console.log('line getOrder', line1.getOrder);
      console.log('order getLineitems', cart1.getLineitems);
    })

  })

  describe('places an order', ()=> {
    it(`returns error 'address required' if there's no address`, ()=> {
      return Order.updateFromRequestBody(cart1.id)
      .then(order=> {
        expect(order).to.be.null;
      }).catch(err=> {
        expect(err.message).to.equal('address required')
      })
    })

    it('places an order with an address', ()=> {
      return Order.updateFromRequestBody(cart1.id, { address })
      .then(order=> {
        expect(order.isCart).to.be.false;
        expect(order.address).to.equal(address);
      }).catch(err=> {
        expect(err).to.be.null;
      })
    })
  })

})
