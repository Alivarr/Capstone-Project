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
  deleteProductFromCart,
  eraseTables,
  createCategory,
  updateCategory,
  deleteCategory,
  checkUserExists,
  checkProductExists,
  checkCategoryExists,
  checkReviewExists,
  checkCartExists,
  checkOrderExists
} = require('./db');
require('dotenv').config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT } = process.env;
const cors = require('cors');
app.use(express.json());
app.use(cors());

const stripe = require('stripe')(process.env.STRIPE_API_KEY);


//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

//this middleware will check if a user is logged dont
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

//this Route will create a new user
app.post('/api/users', async(req, res, next)=> {
  try {
    const user = await createUser(req.body);
    delete user.password;
    const token = jwt.sign({ id: user.id }, JWT);
    res.json({ token, user });
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

//this Route will login a user
app.post('/api/users/login', async(req, res, next)=> {
  try {
    const user = await authenticate(req.body);
    delete user.password;
    const token = jwt.sign({ id: user.id }, JWT);
    res.json({ token, user });
  }
  catch(ex){
    next(ex);
  }
});

//this Route will logout a user
app.post('/api/users/logout', async(req, res, next)=> {
  try {
    await logoutUser(req.body);
    res.send('logged out');
  }
  catch(ex){
    next(ex);
  }
});

//this Route will get the user's information
app.get('/api/users/me', isLoggedIn, async(req, res, next)=> {
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

//this Route will update a user's password
app.put('/api/users/password/:id', async(req, res, next)=> {
  try {
    res.send(await updatePassword(req.params.id, req.body));
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

//this Route will create a new category, for admin use only
app.post('/api/categories', async(req, res, next)=> {
  try {
    res.send(await createCategory(req.body));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will update a category, for admin use only
app.put('/api/categories/:id', async(req, res, next)=> {
  try {
    res.send(await updateCategory(req.params.id, req.body));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will delete a category, for admin use only
app.delete('/api/categories/:id', async(req, res, next)=> {
  try {
    res.send(await deleteCategory(req.params.id));
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


/*checker routes*/

//this Route will check if a user exists
app.get('/api/check/user/:userId', async(req, res, next)=> {
  try {
    res.send(await checkUserExists(req.params.userId));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will check if a product exists
app.get('/api/check/product/:productId', async(req, res, next)=> {
  try {
    res.send(await checkProductExists(req.params.productId));
  }
  catch(ex){
    next(ex);
  }
});

//this Route will check if a category exists
app.get('/api/check/category/:categoryId', async(req, res, next)=> {
  try {
    res.send(await checkCategoryExists(req.params.categoryId));
  }
  catch(ex){
    next(ex);
  }
});


/*debug variables*/


const init = async()=> {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

// Create tables
  await createTables();
    // Seed tables


  // const [ category1, category2, category3, category4 ] = await Promise.all([
  //   createCategory({
  //     name: 'Category 1',
  //     description: 'This is category 1'
  //   }),
  //   createCategory({
  //     name: 'Category 2',
  //     description: 'This is category 2'
  //   }),
  //   createCategory({
  //     name: 'Category 3',
  //     description: 'This is category 3'
  //   }),
  //   createCategory({
  //     name: 'Category 4',
  //     description: 'This is category 4'
  //   })
  // ]);

  // const [ productA, productB, productC, productD ] = await Promise.all([
  //   createProducts({
  //     name: 'Product A',
  //     description: 'This is product A',
  //     price: 100,
  //     rating: 4.5,
  //     imageUrl: 'https://picsum.photos/200/300'
  //   }),
  //   createProducts({
  //     name: 'Product B',
  //     description: 'This is product B',
  //     price: 200,
  //     rating: 3.5,
  //     imageUrl: 'https://picsum.photos/200/300'
  //   }),
  //   createProducts({
  //     name: 'Product C',
  //     description: 'This is product C',
  //     price: 300,
  //     rating: 5,
  //     imageUrl: 'https://picsum.photos/200/300'
  //   }),
  //   createProducts({
  //     name: 'Product D',
  //     description: 'This is product D',
  //     price: 400,
  //     rating: 4,
  //     imageUrl: 'https://picsum.photos/200/300'
  //   })
  // ]);

  //   const [ johndoe, janedoe, bobsmith, alicejohnson ] = await Promise.all([
  //     createUser({
  //       username: 'johndoe',
  //       password: 'password123',
  //       email: 'johndoe@example.com',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       isAdmin: true,
  //       favorite_number: 7
  //     }),
  //     createUser({
  //       username: 'janedoe',
  //       password: 'password456',
  //       email: 'janedoe@example.com',
  //       firstName: 'Jane',
  //       lastName: 'Doe',
  //       isAdmin: false,
  //       favorite_number: 3
  //     }),
  //     createUser({
  //       username: 'bobsmith',
  //       password: 'password789',
  //       email: 'bobsmith@example.com',
  //       firstName: 'Bob',
  //       lastName: 'Smith',
  //       isAdmin: false,
  //       favorite_number: 4
  //     }),
  //     createUser({
  //       username: 'alicejohnson',
  //       password: 'password1011',
  //       email: 'alicejohnson@example.com',
  //       firstName: 'Alice',
  //       lastName: 'Johnson',
  //       isAdmin: false,
  //       favorite_number: 5
  //     })
  //   ]);


    //need to make a console log to validate each thing was created (only users and products for now)
    // console.log('users:', johndoe, janedoe, bobsmith, alicejohnson);
    // console.log('products:', productA, productB, productC, productD);
    
  // //Erase tables
 // await eraseTables();



  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();
