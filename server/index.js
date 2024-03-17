const {
  client,
  createTables,
  createUser,
  fetchUsers,
  authenticate,
  findUserWithToken,
  createProducts,
  getProducts,
  getSingleProduct,
  createCart,
  getCart,
  updateCart,
  createOrder,
  getOrders,
  createReview
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

const isLoggedIn = async(req, res, next)=> {
  try{
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch(ex){
    next(ex);
  }
};

/*User Routes*/
app.post('/api/auth/login', async(req, res, next)=> {
  try {
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

/*Product Routes*/
app.post('/api/products', createProducts);
app.get('/api/products', getProducts);
app.get('/api/products/:id', getSingleProduct);

/*Cart Routes*/
app.post('/api/cart', createCart);
app.get('/api/cart/:userId', getCart);
app.put('/api/cart', updateCart);

/*TIER 2 Routes*/

/*Order Routes*/
app.post('/api/orders', createOrder);
app.get('/api/orders/:userId', getOrders);

/*Review Routes*/
app.post('/api/reviews/:productId', createReview);

/*Error Handling*/
app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async()=> {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');

  const [moe, lucy, ethyl, curly] = await Promise.all([
    createUser({ username: 'moe', password: 'm_pw'}),
    createUser({ username: 'lucy', password: 'l_pw'}),
    createUser({ username: 'ethyl', password: 'e_pw'}),
    createUser({ username: 'curly', password: 'c_pw'})
  ]);

  console.log(await fetchUsers());

  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();

