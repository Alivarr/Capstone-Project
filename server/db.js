const pg = require('pg');
require('dotenv').config();
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/fsa_app_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
if(JWT === 'shhh'){
  console.log('If deployed, set process.env.JWT to something other than shhh');
}

const createTables = async()=> {
  const SQL = `
    CREATE TABLE IF NOT EXISTS users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items(
     id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      price DECIMAL(10, 2),
      category varchar(100),
      imageUrl VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS orders(
      id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id),
      status VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS order_items(
      id UUID PRIMARY KEY,
      quantity INT,
      price DECIMAL(10, 2),
      orderId UUID REFERENCES orders(id),
      itemId UUID REFERENCES items(id)
    );  
    
    CREATE TABLE IF NOT EXISTS carts(
      id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id),
      status VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS cart_items(
      id UUID PRIMARY KEY,
      quantity INT,
      price DECIMAL(10, 2),
      cartId UUID REFERENCES carts(id),
      itemId UUID REFERENCES items(id)
    );
  `;
  await client.query(SQL);
};

const eraseTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS items CASCADE;
    DROP TABLE IF EXISTS carts CASCADE;
    DROP TABLE IF EXISTS cart_items CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS orders_items CASCADE;
    DROP TABLE IF EXISTS reviews CASCADE;
  `;
  await client.query(SQL);
};

//Create user is going to take the inputed information from the user and add it to the database
const createUser = async({ username, password, email})=> {
  const SQL = `
  INSERT INTO users(id, username, password, email) 
  VALUES($1, $2, $3, $4)
  RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5), email]);
  return response.rows[0];
};

//Authenticate is going to take the inputed information from the user and check it against the database to see if it is correct
const authenticate = async({ username, password })=> {
  const SQL = `SELECT * FROM users WHERE username=$1`;
  const response = await client.query(SQL, [username]);
  const user = response.rows[0];
  if(!user){
    const error = Error('bad username');
    error.status = 401;
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);
  if(!match){
    const error = Error('bad password');
    error.status = 401;
    throw error;
  }
  return {user};
};


//findUserWithToken is going to take the token from the user and check it against the database to see if it is correct

// const findUserWithToken = async(token)=> {
//   let id;
//   try {
//     const payload = jwt.verify(token, JWT);
//     id = payload.id;
//   } catch(ex){
//     const error = Error('not authorized');
//     error.status = 401;
//     throw error;
//   }

//   const SQL = `
//   SELECT id, username FROM users WHERE id=$1;
//   `;
//   const response = await client.query(SQL, [id]);
//   if(!response.rows.length){
//     const error = Error('not authorized');
//     error.status = 401;
//     throw error;
//   }
//   return response.rows[0];
// }
// ;


//Fetch users is going to return all the users from the database
const fetchUsers = async()=> {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//fetchSingleUser is going to return a single user from the database, i think i'm going to have to do this by username
fetchSingleUser = async(username)=> {
  const SQL = `
    SELECT * FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  return response.rows[0];
};

//updateUser is going to update a user in the database
//need to add the ability to update any of the user information from the createtabe:Users
updateUser = async({ username, password, email })=> {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const SQL = `
    UPDATE users
    SET username=$1, password=$2, email=$3
    WHERE id=$4
    RETURNING *
  `;
  const response = await client.query(SQL, [username, hashedPassword, email]);
  return response.rows[0];
};


//deleteUser is going to delete a user from the database
deleteUser = async(user_id)=> {
  const SQL = `
    DELETE FROM users WHERE id=$1;
  `;
  await client.query(SQL, [user_id]);
};


/*MORE RELEVERANT TO TIER 1*/

//need to make a createitems function that takes in a item object and adds it to the database
createitems = async({ name, description, price, category, imageUrl })=> {
  const existingitem = await checkitemExists(name);
  if (existingitem) {
    throw new Error('item with this name already exists');
  }

  const SQL = `
    INSERT INTO items(id, name, description, price, category, imageUrl)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, description, price, category, imageUrl]);
  return response.rows[0];
};

//need to make a fetchitems function that returns all items from the database
fetchitems = async()=> {
  const SQL = `
    SELECT * FROM items;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//Want to make a fetchLimiteditems function that returns a limited amount of items from the database
fetchLimiteditems = async()=> {
  const SQL = `
    SELECT * FROM items LIMIT 10;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//need to make a fetchSingleitem function that takes in a item.id from the database and returns on a screen with the info on that item
fetchSingleitem = async(id)=> {
  const SQL = `
    SELECT * FROM items WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

//want to make an updateitem function that updates a item in the database incase
updateitem = async({ name, description, price, category, imageUrl })=> {
  const SQL = `
    UPDATE items
    SET name=$1, description=$2, price=$3, category=$4, imageUrl=$5
    WHERE id=$6
    RETURNING *
  `;
  const response = await client.query(SQL, [name, description, price, category, imageUrl]);
  return response.rows[0];
};

//want to make a deleteitem function that deletes a item from the database incase
deleteitem = async(id)=> {
  const SQL = `
    DELETE FROM items WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};

/*order functions/ aka cart functions*/

//fetchOrders is going to return all the orders from the database
fetchOrders = async()=> {
  const SQL = `
    SELECT * FROM orders;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//createOrder is going to take the inputed information from the user and add it to the database
createOrder = async({ userId, status })=> {
  const SQL = `
    INSERT INTO orders(id, userId, status)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), userId, status]);
  return response.rows[0];
};

//need to make a deleteOrder function that deletes an order from the database incase
deleteOrder = async(id)=> {
  const SQL = `
    DELETE FROM orders WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};

//need to make an updateOrder function that updates an order in the database incase
updateOrder = async({ userId, status })=> {
  const SQL = `
    UPDATE orders
    SET userId=$1, status=$2
    WHERE id=$3
    RETURNING *
  `;
  const response = await client.query(SQL, [userId, status]);
  return response.rows[0];
};

/*order_items functions*/

//need to make a createOrderitem function that takes in a orderitem object and adds it to the database
createOrderitem = async({ quantity, price, orderId, itemId })=> {
  const SQL = `
    INSERT INTO order_items(id, quantity, price, orderId, itemId)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), quantity, price, orderId, itemId]);
  return response.rows[0];
};

//need to make a deleteOrderitem function that deletes an orderitem from the database incase
deleteOrderitem = async(id)=> {
  const SQL = `
    DELETE FROM order_items WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};

//need to make an updateOrderitem function that updates an orderitem in the database incase
updateOrderitem = async({ quantity, price, orderId, itemId })=> {
  const SQL = `
    UPDATE order_items
    SET quantity=$1, price=$2, orderId=$3, itemId=$4
    WHERE id=$5
    RETURNING *
  `;
  const response = await client.query(SQL, [quantity, price, orderId, itemId]);
  return response.rows[0];
};

/*cart functions*/

//fetchCart is going to return all the carts from the database
fetchCart = async()=> {
  const SQL = `
    SELECT * FROM carts;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//createCart is going to take the inputed information from the user and add it to the database
createCart = async({ userId, status })=> {
  const SQL = `
    INSERT INTO carts(id, userId, status)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), userId, status]);
  return response.rows[0];
};

//need to make a deleteCart function that deletes a cart from the database incase
deleteCart = async(id)=> {
  const SQL = `
    DELETE FROM carts WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};

//need to make an updateCart function that updates a cart in the database incase
updateCart = async({ userId, status })=> {
  const SQL = `
    UPDATE carts
    SET userId=$1, status=$2
    WHERE id=$3
    RETURNING *
  `;
  const response = await client.query(SQL, [userId, status]);
  return response.rows[0];
};

//need to make a fetchUsersCart function that returns the logged in users cart
fetchUsersCart = async(user_id)=> {
  const SQL = `
    SELECT * FROM carts WHERE userId=$1;
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

/*cart_items functions*/

//need to make a createCartitem function that takes in a cartitem object and adds it to the database
createCartitem = async({ quantity, price, cartId, itemId })=> {
  const SQL = `
    INSERT INTO cart_items(id, quantity, price, cartId, itemId)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), quantity, price, cartId, itemId]);
  return response.rows[0];
};

//need to make an updateCartitem function that updates a cartitem in the database incase
updateCartitem = async({ quantity, price, cartId, itemId })=> {
  const SQL = `
    UPDATE cart_items
    SET quantity=$1, price=$2, cartId=$3, itemId=$4
    WHERE id=$5
    RETURNING *
  `;
  const response = await client.query(SQL, [quantity, price, cartId, itemId]);
  return response.rows[0];
};

//need to make a fetchCartitems function that returns all the items in a cart
fetchCartitems = async(id)=> {
  const SQL = `
    SELECT * FROM cart_items WHERE cartId=$1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

//need to make a additemToCart function that adds a item to a cart
additemToCart = async({ cartId, itemId })=> {
  const SQL = `
    INSERT INTO cart_items(id, quantity, price, cartId, itemId)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), 1, price, cartId, itemId]);
  return response.rows[0];
};

//need to make a deleteitemFromCart function that deletes a item from a cart
deleteitemFromCart = async({ cartId, itemId })=> {
  const SQL = `
    DELETE FROM cart_items WHERE cartId=$1 AND itemId=$2;
  `;
  await client.query(SQL, [cartId, itemId]);
};


checkitemExists = async(name) => {
  const SQL = `
    SELECT * FROM items WHERE name=$1;
  `;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
};

checkUserExists = async(username) => {
  const SQL = `
    SELECT * FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  return response.rows[0];
};





module.exports = {
  client,
  createTables,
  eraseTables,
  createUser,
  authenticate,
//  findUserWithToken,
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
};