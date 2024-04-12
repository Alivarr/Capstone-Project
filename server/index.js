const {
  client,
  createTables,
  eraseTables,
  createUser,
  authenticate,
 // findUserWithToken,
  fetchUsers,
  fetchSingleUser,
  updateUser,
  deleteUser,
  createitems,
  fetchitems,
  fetchLimiteditems,
  fetchSingleitem,
  updateitem,
  deleteitem,
  fetchOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  createOrderitem,
  deleteOrderitem,
  updateOrderitem,
  fetchCart,
  createCart,
  deleteCart,
  updateCart,
  fetchUsersCart,
  createCartitem,
  updateCartitem,
  fetchCartitems,
  additemToCart,
  deleteitemFromCart,
  checkitemExists,
  checkUserExists
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
const { en } = require('faker/lib/locales');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
  
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});



//this middleware will check if a user is logged dont
function isLoggedIn(req, res, next){
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, JWT);
    req.user = user;
    next();
  } catch (ex) {
    res.status(401).send({ error: 'Invalid token' });
  }
}

//this function will calculate the total of the items in the cart
const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};



/*User Routes*/

//this Route will create a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


//this Route will fetch a single user
app.get('/api/users/:id', async (req, res, next) => {
  try {
    res.send(await fetchSingleUser(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will login a user then return a token.
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

//this Route will fetch the user's information via token
app.get('/api/auth/me', isLoggedIn, async (req, res, next) => {
  try {
    res.send(req.user);
  }
  catch (ex) {
    next(ex);
  }
});

//this route should log a user out by removing the token
app.get('/api/auth/logout', async (req, res, next) => {
  try {
    res.send({ message: 'logged out' });
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will delete a user
app.delete('/api/users/:id', async (req, res, next) => {
  try {
    res.send(await deleteUser(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will return all users, for admin use only
app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will update a user's information
app.put('/api/users/:id', async (req, res, next) => {
  try {
    res.send(await updateUser(req.params.id, req.body));
  }
  catch (ex) {
    next(ex);
  }
});

/*item Routes*/

//this Route will create a new item, for admin use only
app.post('/api/items', async (req, res, next) => {
  try {
    res.send(await createitems(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will fetch all items
app.get('/api/items', async (req, res, next) => {
  try {
    res.send(await fetchitems());
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will fetch a single item
app.get('/api/items/:id', async (req, res, next) => {
  try {
    res.send(await fetchSingleitem(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will fetch a limited number of items
app.get('/api/items/limited', async (req, res, next) => {
  try {
    res.send(await fetchLimiteditems());
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will delete a item, for admin use only
app.delete('/api/items/:id', async (req, res, next) => {
  try {
    res.send(await deleteitem(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will update a item, for admin use only
app.put('/api/items/:id', async (req, res, next) => {
  try {
    res.send(await updateitem(req.params.id, req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will add a item to the cart making it a cart item
app.post('/api/cart/items', async (req, res, next) => {
  try {
    res.send(await additemToCart(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will delete a item from the cart
app.delete('/api/cart/items/:id', async (req, res, next) => {
  try {
    res.send(await deleteitemFromCart(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will fetch all items in the cart
app.get('/api/cart/items', async (req, res, next) => {
  try {
    res.send(await fetchCartitems());
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will update a item in the cart
app.put('/api/cart/items/:id', async (req, res, next) => {
  try {
    res.send(await updateCartitem(req.params.id, req.body));
  }
  catch (ex) {
    next(ex);
  }
});

/*Cart Routes*/

//this Route will fetch all carts, for admin use only
app.get('/api/carts', async (req, res, next) => {
  try {
    res.send(await fetchCart());
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will create a new cart
app.post('/api/carts', async (req, res, next) => {
  try {
    res.send(await createCart(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will delete a cart, for admin use only
app.delete('/api/carts/:id', async (req, res, next) => {
  try {
    res.send(await deleteCart(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will update a cart
app.put('/api/carts/:id', async (req, res, next) => {
  try {
    res.send(await updateCart(req.params.id, req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will fetch a user's cart
app.get('/api/users/:id/cart', async (req, res, next) => {
  try {
    res.send(await fetchUsersCart(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will create a new cart item
app.post('/api/cart/items', async (req, res, next) => {
  try {
    res.send(await createCartitem(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will update a cart item
app.put('/api/cart/items/:id', async (req, res, next) => {
  try {
    res.send(await updateCartitem(req.params.id, req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will delete a cart item
app.delete('/api/cart/items/:id', async (req, res, next) => {
  try {
    res.send(await deleteCartitem(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

/*Order Routes*/

//this Route will fetch all orders, for admin use only
app.get('/api/orders', async (req, res, next) => {
  try {
    res.send(await fetchOrders());
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will create a new order
app.post('/api/orders', async (req, res, next) => {
  try {
    res.send(await createOrder(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will delete an order, for admin use only
app.delete('/api/orders/:id', async (req, res, next) => {
  try {
    res.send(await deleteOrder(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will update an order
app.put('/api/orders/:id', async (req, res, next) => {
  try {
    res.send(await updateOrder(req.params.id, req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will create a new order item
app.post('/api/order/items', async (req, res, next) => {
  try {
    res.send(await createOrderitem(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will update an order item
app.put('/api/order/items/:id', async (req, res, next) => {
  try {
    res.send(await updateOrderitem(req.params.id, req.body));
  }
  catch (ex) {
    next(ex);
  }
});

//this Route will delete an order item
app.delete('/api/order/items/:id', async (req, res, next) => {
  try {
    res.send(await deleteOrderitem(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});


/*Error Handling*/
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});


/*Stripe Routes*/
app.post('/api/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.items.map(item => ({
      price_data: {
        currency: 'usd',
        item_data: {
          name: item.name,
          images: [item.imageUrl]
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    })),
    mode: 'payment',
    success_url: `${req.headers.origin}/`,
    cancel_url: `${req.headers.origin}/cart`
  });

  res.json({ id: session.id });
});



/*debug variables*/


const init = async () => {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  // Create tables
  await createTables();
  // Seed tables


  // const [ itemA, itemB, itemC, itemD ] = await Promise.all([
  //   createitems({
  //     name: 'item A',
  //     description: 'This is item A',
  //     price: 10.00,
  //     category: 'Minis',
  //     imageUrl: 'https://picsum.photos/200/300'
  //   }),
  //   createitems({
  //     name: 'item B',
  //     description: 'This is item B',
  //     price: 20.0,
  //     category: 'Minis',
  //     imageUrl: 'https://picsum.photos/200/300'
  //   }),
  //   createitems({
  //     name: 'item C',
  //     description: 'This is item C',
  //     price: 30.0,
  //     category: 'TTRPG',
  //     imageUrl: 'https://picsum.photos/200/300'
  //   }),
  //   createitems({
  //     name: 'item D',
  //     description: 'This is item D',
  //     price: 40.0,
  //     category: 'TTRPG',
  //     imageUrl: 'https://picsum.photos/200/300'
  //   })
  // ]);

  //   const [ johndoe, janedoe, bobsmith, alicejohnson ] = await Promise.all([
  //     createUser({
  //       username: 'johndoe',
  //       password: 'password123',
  //       email: 'johndoe@example.com',
  //     }),
  //     createUser({
  //       username: 'janedoe',
  //       password: 'password456',
  //       email: 'janedoe@example.com',
  //     }),
  //     createUser({
  //       username: 'bobsmith',
  //       password: 'password789',
  //       email: 'bobsmith@example.com',
  //       }),
  //     createUser({
  //       username: 'alicejohnson',
  //       password: 'password1011',
  //       email: 'alicejohnson@example.com',
  //       })
  //   ]);

  //     const [ cartA, cartB, cartC, cartD ] = await Promise.all([
  //       createCart({
  //         userId: johndoe.id,
  //         status: 'active'
  //       }),
  //       createCart({
  //         userId: janedoe.id,
  //         status: 'active'
  //       }),
  //       createCart({
  //         userId: bobsmith.id,
  //         status: 'active'
  //       }),
  //       createCart({
  //         userId: alicejohnson.id,
  //         status: 'active'
  //       })
  //     ]);

  //     const [ cartitemA, cartitemB, cartitemC, cartitemD ] = await Promise.all([
  //       createCartitem({
  //         cartId: cartA.id,
  //         itemId: itemA.id,
  //         quantity: 1
  //       }),
  //       createCartitem({
  //         cartId: cartB.id,
  //         itemId: itemB.id,
  //         quantity: 2
  //       }),
  //       createCartitem({
  //         cartId: cartC.id,
  //         itemId: itemC.id,
  //         quantity: 3
  //       }),
  //       createCartitem({
  //         cartId: cartD.id,
  //         itemId: itemD.id,
  //         quantity: 4
  //       })
  //     ]);


  //need to make a console log to validate each thing was created (only users and items for now)
  // console.log('users:', johndoe, janedoe, bobsmith, alicejohnson);
  // console.log('items:', itemA, itemB, itemC, itemD);

  //Erase tables
 //await eraseTables();



  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
