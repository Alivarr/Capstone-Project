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
  createReview,
  getLimitedProducts,
  getCategories,
  getSingleCategory,
  getAllCarts,
  deleteUser,
  updateUser,
  deleteProduct,
  updateProduct,
  deleteCart,
  fetchSingleUser,
  getUsersReviews,
  getReviews,
  deleteReview,
  getUserAccountInfo,
  getUserOrders,
  getCartProducts,
  addProductToCart,
  deleteProductFromCart
} = require('./db');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT } = process.env;
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

//this Routse will sign up a new user
app.post('/api/auth/signup', async(req, res, next)=> {
  try {
    const user = await createUser(req.body);
    const token = jwt.sign({ id: user.id }, JWT);
    res.send({ token, user });
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get a single user
app.get('/api/users/:id', async(req, res, next)=> {
  try {
    res.send(await fetchSingleUser(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will log in a user
app.post('/api/auth/login', async(req, res, next)=> {
  try {
    const user = await authenticate(req.body);
    const token = jwt.sign({ id: user.id }, JWT);
    res.send({ token, user });
  }
  catch(ex){
    next(ex);
  }
}); 

//this Route will get the user's information
app.get('/api/auth/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  }
  catch(ex){
    next(ex);
  }
});

//this Route will return all users, for admin use only
app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

//this Route will delete a user, for admin use only (would technically be accessable by the user in their account)
app.delete('/api/users/:id', async(req, res, next)=> {
  try {
    res.send(await deleteUser(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will update a user for when they change any of their information
app.put('/api/users/:id', async(req, res, next)=> {
  try {
    res.send(await updateUser(req.params.id, req.body));
  }
  catch(ex){
    next(ex);
  }
});


/*Product Routes*/

//this Route will create a new product, for admin use only
app.post('/api/products', async(req, res, next)=> {
  try {
    res.send(await createProducts(req.body));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get all products
app.get('/api/products', async(req, res, next)=> {
  try {
    res.send(await getProducts());
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get a single product
app.get('/api/products/:id', async(req, res, next)=> {
  try {
    res.send(await getSingleProduct(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get a limited number of products
app.get('/api/products/limited', async(req, res, next)=> {
  try {
    res.send(await getLimitedProducts());
  }
  catch(ex){
    next(ex);
  }
});

//this Route will delete a product, for admin use only
app.delete('/api/products/:id', async(req, res, next)=> {
  try {
    res.send(await deleteProduct(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will update a product, for admin use only
app.put('/api/products/:id', async(req, res, next)=> {
  try {
    res.send(await updateProduct(req.params.id, req.body));
  }
  catch(ex){
    next(ex);
  }
}); 

/*Cart Routes*/

//this Route will create a new cart for a user
app.post('/api/carts/:userId', async(req, res, next)=> {
  try {
    res.send(await createCart(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get a user's cart
app.get('/api/carts/:userId', async(req, res, next)=> {
  try {
    res.send(await getCart(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will update a user's cart
app.put('/api/carts/:userId', async(req, res, next)=> {
  try {
    res.send(await updateCart(req.params.userId, req.body));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get all carts, for admin use only
app.get('/api/carts', async(req, res, next)=> {
  try {
    res.send(await getAllCarts());
  }
  catch(ex){
    next(ex);
  }
});

//this Route will delete a user's cart, for admin use/user only
app.delete('/api/carts/:id', async(req, res, next)=> {
  try {
    res.send(await deleteCart(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});


/*TIER 2 Routes*/

/*Order Routes*/

//this Route will create a new order for a user
app.post('/api/orders/:userId', async(req, res, next)=> {
  try {
    res.send(await createOrder(req.params.userId, req.body));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get all orders for a user
app.get('/api/orders/:userId', async(req, res, next)=> {
  try {
    res.send(await getOrders(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

/*Category Routes*/

//this Route will get all categories
app.get('/api/categories', async(req, res, next)=> {
  try {
    res.send(await getCategories());
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get a single category
app.get('/api/categories/:id', async(req, res, next)=> {
  try {
    res.send(await getSingleCategory(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});


/*Review Routes*/

//this Route will create a new review for a product
app.post('/api/reviews/:productId', async(req, res, next)=> {
  try {
    res.send(await createReview(req.params.productId, req.body));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get all reviews for a product
app.get('/api/reviews/:productId', async(req, res, next)=> {
  try {
    res.send(await getReviews(req.params.productId));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will delete a review, for admin use only
app.delete('/api/reviews/:id', async(req, res, next)=> {
  try {
    res.send(await deleteReview(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get all reviews for a user
app.get('/api/reviews/:userId', async(req, res, next)=> {
  try {
    res.send(await getUsersReviews(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

/*User Account Info Routes*/

//this Route will get a user's account information
app.get('/api/account/:userId', async(req, res, next)=> {
  try {
    res.send(await getUserAccountInfo(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get all orders for a user
app.get('/api/account/orders/:userId', async(req, res, next)=> {
  try {
    res.send(await getUserOrders(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

/*Cart Product Routes*/

//this Route will get all products in a user's cart
app.get('/api/cart/products/:userId', async(req, res, next)=> {
  try {
    res.send(await getCartProducts(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will add a product to a user's cart
app.post('/api/cart/products/:userId', async(req, res, next)=> {
  try {
    res.send(await addProductToCart(req.params.userId, req.body));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will delete a product from a user's cart
app.delete('/api/cart/products/:userId', async(req, res, next)=> {
  try {
    res.send(await deleteProductFromCart(req.params.userId, req.body));
  }
  catch(ex){
    next(ex);
  }
});


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
    createUser({ username: 'moe', password: 'm_pw', email: 'test1@test.com', isAdmin: true}),
    createUser({ username: 'lucy', password: 'l_pw', email: 'test2@test.com', isAdmin: false}),
    createUser({ username: 'ethyl', password: 'e_pw', email: 'test3@test.com', isAdmin: false}),
    createUser({ username: 'curly', password: 'c_pw', email: 'test4@test.com', isAdmin: true})
  ]);

  const [product1, product2, product3, product4] = await Promise.all([
    createProducts({ name: 'product1', price: 100, description: 'product1 description', inventory: 10, categoryId: 1}),
    createProducts({ name: 'product2', price: 200, description: 'product2 description', inventory: 20, categoryId: 2}),
    createProducts({ name: 'product3', price: 300, description: 'product3 description', inventory: 30, categoryId: 3}),
    createProducts({ name: 'product4', price: 400, description: 'product4 description', inventory: 40, categoryId: 4})
  ]);

  const [cart1, cart2, cart3, cart4] = await Promise.all([
    createCart(moe.id),
    createCart(lucy.id),
    createCart(ethyl.id),
    createCart(curly.id)
  ]);

  const [order1, order2, order3, order4] = await Promise.all([
    createOrder(moe.id, { cartId: cart1.id, status: 'completed'}),
    createOrder(lucy.id, { cartId: cart2.id, status: 'completed'}),
    createOrder(ethyl.id, { cartId: cart3.id, status: 'completed'}),
    createOrder(curly.id, { cartId: cart4.id, status: 'completed'})
  ]);

  const [review1, review2, review3, review4] = await Promise.all([
    createReview(product1.id, { userId: moe.id, content: 'product1 review'}),
    createReview(product2.id, { userId: lucy.id, content: 'product2 review'}),
    createReview(product3.id, { userId: ethyl.id, content: 'product3 review'}),
    createReview(product4.id, { userId: curly.id, content: 'product4 review'})
  ]);

    console.log(await fetchUsers());
    console.log(await getProducts());
    console.log(await getLimitedProducts());
    console.log(await getCategories());

  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();
