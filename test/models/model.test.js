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
        // return Promise.all([
        //   LineItem.create({ productId: foo.id }),
        //   LineItem.create({ productId: bar.id })
        // ])
      })
      // }).then(([l1, l2])=> {
      //   line1 = l1;
      //   line2 = l2;
      //   return Order.create({});
      // }).then(order=> {
      //   line1.setOrder(order);
      //   line2.setOrder(order);
      // })
    })

    it('throws error if product doesnt exist', ()=> {
      return Order.addProductToCart().catch(err=> {
        expect(err.message).to.equal('product not found');
      });
    })

    it('adds a product to cart', ()=> {
      return Order.addProductToCart(foo.id)
        .then(result=> {
          expect(result[0] instanceof LineItem).to.be.true;
          return result[0];
        }).then(newLI=> {
          expect(newLI.productId).to.equal(foo.id);
          return Order.findOne({ id: newLI.orderId });
        }).then(order=> {
          expect(order).to.be.ok;
        })
    })

  })

})
