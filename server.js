// lets do eeet
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const nunjucks = require('nunjucks');
const path = require('path');
const orders = require('./routes/orders');
const conn = require('./db');
const seed = require('./seed');

const app = express();

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

app.use(morgan('dev'));
app.use(express.static(path.resolve('public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(orders);

app.use((err, req, res, next)=> {
  res.render('error', { err });
})

const port = process.env.PORT || 3000;

conn.sync()
  .then(()=> {
    return seed();
  }).then(()=> {
    app.listen(port, ()=> {
      console.log(`listening on port ${port}`);
    })
  })