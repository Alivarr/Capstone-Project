const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/fsa_app_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
if(JWT === 'shhh'){
  console.log('If deployed, set process.env.JWT to something other than shhh');
}

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      isAdmin BOOLEAN DEFAULT FALSE,
      favorite_number INTEGER 
    );

    DROP TABLE IF EXISTS products CASCADE;
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      type VARCHAR(255),
      imageUrl VARCHAR(255)
    );

    DROP TABLE IF EXISTS carts CASCADE;
    CREATE TABLE carts(
      id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id)
    );
  
    DROP TABLE IF EXISTS cart_products CASCADE;
    CREATE TABLE cart_products(
      cartId UUID REFERENCES carts(id),
      productId UUID REFERENCES products(id),
      quantity INTEGER,
      PRIMARY KEY (cartId, productId)
    );
  
    DROP TABLE IF EXISTS orders CASCADE;
    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id),
      totalPrice DECIMAL(10, 2),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
    DROP TABLE IF EXISTS order_products CASCADE;
    CREATE TABLE order_products(
      orderId UUID REFERENCES orders(id),
      productId UUID REFERENCES products(id),
      quantity INTEGER,
      PRIMARY KEY (orderId, productId)
    );
   
  `;
  await client.query(SQL);
};

const createUser = async({ username, password, email, isAdmin, favorite_number })=> {
  const SQL = `
    INSERT INTO users(id, username, password, email, isAdmin, favorite_number) 
    VALUES($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5), email, isAdmin, favorite_number]);
  return response.rows[0];
}

const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, username, password FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token };
};

const findUserWithToken = async(token)=> {
  let id;
  try{
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }
  catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

/*MORE RELEVERANT TO TIER 1*/

//need to make a createProducts function that takes in a product object and adds it to the database
createProducts = async()=> {
  const SQL = `
    
     `;
  await client.query(SQL);
};

//need to make a getProducts function that returns all products from the database
getProducts = async()=> {
  const SQL =``;
  await client.query(SQL);
};

//need to make a getSingleProduct function that takes in a product.id from the database and returns on a screen with the info on that product
getSingleProduct = async(id)=> {
  const SQL =``;
  await client.query(SQL);
}; 

//need to make a createCart function that creates a cart for a user
createCart = async()=> {
  const SQL =``;
  await client.query(SQL);
};

//need to make a getCart function that would retrieve a users cart based on the user.id
getCart = async(userId)=> {
  const SQL =``;
  await client.query(SQL);
};

//need to make a updateCart function that would update a users cart on the cart table
updateCart = async()=> {
  const SQL =``;
  await client.query(SQL);
};


/*MORE RELEVERANT TO TIER 2*/

//need to make a createOrder function that would create an order for a user
createOrder = async()=> {
  const SQL =``;
  await client.query(SQL);
};

//need to make a getOrders function that would retrieve a users orders based on the user.id
getOrders = async(userId)=> {
  const SQL =``;
  await client.query(SQL);
};

//need to make a createReview function that would create a review for a product
createReview = async(productId)=> {
  const SQL =``;
  await client.query(SQL);
};

module.exports = {
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
};
