const expect = require('chai').expect;
const db = require('../../db');
const Product = db.models.Product;
const LineItem = db.models.LineItem;
const Order = db.models.Order;


describe('Models', ()=> {

  beforeEach(()=> {
    return db.sync();
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

  describe('creates and destroys', ()=> {
    let p1, l1;
    it('creates a new Product, LineItem, and Order', ()=> {
      return Product.create({
        name: "Test product"
      }).then(newProduct=> {
        p1 = newProduct
        return LineItem.create({
          quantity: 4
        })
      }).then(newLineItem=> {
        l1 = newLineItem;
        return Order.create({})
      }).then(newOrder=> {
        expect(p1).to.be.ok;
        expect(l1).to.be.ok;
        expect(newOrder).to.be.ok;
      })
    })
  })

  describe('update Order', ()=> {
    it('deletes an order with 0 items in cart', ()=> {

    })

    it('returns error when address is empty', ()=> {
      return Order.create({})
        .then(newOrder=> {
          return newOrder.placeOrder()
        }).catch(err=> {
          expect(err.message).to.equal('address required')
        })
    })

    it('succeeds', ()=> {
      let address = '123 awesome place, cp';
      return Order.create({})
        .then(newOrder=> {
          return newOrder.placeOrder(address)
        }).then(finalized=> {
          expect(finalized.isCart).to.equal(false);
          expect(finalized.address).to.equal(address);
        })
    })
  })

  describe('update LineItem', ()=> {

    let foo, bar, baz, line1, line2, cart1;
    beforeEach(()=> {
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

    xit('deletes an item from cart', ()=> {
      
    })

    xit('tests', ()=> {
      console.log('line getProduct', line1.getProduct);
      console.log('product getLineItems', foo.getLineitems); // NOTE: camel case ignored
      console.log('line getOrder', line1.getOrder);
      console.log('order getLineitems', cart1.getLineitems);
    })

  })

})
