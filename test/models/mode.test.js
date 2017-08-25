const expect = require('chai').expect;
const db = require('../../db');
const Product = db.models.Product;
const LineItem = db.models.LineItem;
const Order = db.models.Order;


describe('Models', ()=> {

  beforeEach(()=> {
    return db.sync();
  })

  describe('exists', ()=> {
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
        return Order.create({

        })
      }).then(newOrder=> {
        expect(p1).to.be.ok;
        expect(l1).to.be.ok;
        expect(newOrder).to.be.ok;
      })
    })

    // it('destroys a product by id', ()=> {
    //   return Product.create({
    //     name: "Test"
    //   }).then(newProduct=> {
    //     return Product.destroy({
    //       where: { id: newProduct.id }
    //     });
    //   }).then(destroyed=> {
    //     expect(destroyed).to.be.ok;
    //   })
    // })
  })
})