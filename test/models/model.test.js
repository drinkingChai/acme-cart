const expect = require('chai').expect;
const db = require('../../db');
const Product = db.models.Product;
const LineItem = db.models.LineItem;
const Order = db.models.Order;


describe('Models', ()=> {

  let foo, bar, baz,
    address = { address: `123 awesome place, NY 12045`};
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

  describe('Product and Cart', ()=> {
    it('adds a product to cart', ()=> {
      return Order.addProductToCart(foo.id)
      .then(lineitem=> {
        expect(lineitem.productId).to.equal(foo.id);
        expect(lineitem.productId).to.not.equal(bar.id);
        expect(lineitem.orderId).to.equal(1);
        expect(lineitem.quantity).to.equal(1);
      })
    })

    it('adds product multiple times to cart', ()=> {
      return Order.addProductToCart(foo.id)
      .then(()=> {
        return Order.addProductToCart(foo.id)
      }).then(()=> {
        return LineItem.findOne({ where: { orderId: 1, productId: foo.id }})
      }).then(lineitem=> {
        expect(lineitem.quantity).to.equal(2);
      })
    })

    it('destroys a cart when its empty', ()=> {
      return Order.addProductToCart(foo.id)
      .then(lineitem=> {
        return Order.destroyLineItem(1, lineitem.id)
      }).then(()=> {
        return Order.findAll();
      }).then(orders=> {
        expect(orders.length).to.equal(0);
      })
    })
  })

  describe('LineItem', ()=> {
    let cart, lineitem;
    beforeEach(()=> {
      return Order.addProductToCart(foo.id)
      .then(newLineItem=> {
        lineitem = newLineItem;
        return Order.findOne({ where: { id: lineitem.orderId }})
      }).then(order=> {
        cart = order;
      })
    })

    it('destroys a line item', ()=> {
      return Order.destroyLineItem(cart.id, lineitem.id)
      .then(()=> {
        return LineItem.findOne({ where: { id: lineitem.id }})
      }).then(lineitem=> {
        expect(lineitem).to.be.null;
      })
    })

    it('destroys a line item when quantity is 0', ()=> {
      return lineitem.removeOne()
      .then(lineitem=> {
        return LineItem.findOne({ where: { id: lineitem.id }})
      }).then(lineitem=> {
        expect(lineitem).to.be.null;
      })
    })
  })

  describe('Place an order', ()=> {
    let cart;
    beforeEach(()=> {
      return Order.addProductToCart(foo.id)
      .then(lineitem=> {
        return Order.findOne({ where: { id: lineitem.orderId }})
      }).then(order=> {
        cart = order;
      })
    })

    it('places an order', ()=> {
      return Order.updateFromRequestBody(cart.id, address)
      .then(order=> {
        expect(order.isCart).to.be.false;
        expect(order.address).to.equal(address.address);
      })
    })

    it('returns an error if theres no address', ()=> {
      return Order.updateFromRequestBody(cart.id)
      .catch(err=> {
        expect(err.message).to.equal(`address required`);
      })
    })
  })

})
