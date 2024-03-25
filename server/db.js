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
    CREATE TABLE IF NOT EXSISTS users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      isAdmin BOOLEAN,
      favorite_number INTEGER
    );

    CREATE TABLE IF NOT EXSISTS categories(
      id UUID PRIMARY KEY,
      name VARCHAR(20) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXSISTS products(
      id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      price DECIMAL(10, 2),
      category UUID REFERENCES categories(id),
      rating DECIMAL(2, 1),
      imageUrl TEXT
    );

    CREATE TABLE IF NOT EXSISTS carts(
      id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE IF NOT EXSISTS cart_products(
      cartId UUID REFERENCES carts(id),
      productId UUID REFERENCES products(id),
      quantity INTEGER,
      PRIMARY KEY (cartId, productId)
    );
  
    CREATE TABLE IF NOT EXSISTS orders(
      id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id),
      totalPrice DECIMAL(10, 2),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE IF NOT EXSISTS order_products(
      orderId UUID REFERENCES orders(id),
      productId UUID REFERENCES products(id),
      quantity INTEGER,
      PRIMARY KEY (orderId, productId)
    );

    CREATE TABLE IF NOT EXSISTS reviews(
      id UUID PRIMARY KEY,
      productId UUID REFERENCES products(id),
      userId UUID REFERENCES users(id),
      review TEXT
    );
   
  `;
  await client.query(SQL);
};

//Create user is going to take the inputed information from the user and add it to the database
const createUser = async({ username, password, email, isAdmin, favorite_number })=> {
  const SQL = `
    INSERT INTO users(id, username, password, email, isAdmin, favorite_number) 
    VALUES($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5), email, isAdmin, favorite_number]);
  return response.rows[0];
}

//Authenticate is going to take the inputed information from the user and check it against the database to see if it is correct
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


//Litterally going to find the user with the token,
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

//Fetch users is going to return all the users from the database
const fetchUsers = async()=> {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//fetchSingleUser is going to return a single user from the database
const fetchSingleUser = async(id)=> {
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

//updateUser is going to update a user in the database
updateUser = async({ username, password, email, isAdmin, favorite_number })=> {
  const SQL = `
    UPDATE users
    SET username=$1, password=$2, email=$3, isAdmin=$4, favorite_number=$5
    WHERE id=$6
    RETURNING *
  `;
  const response = await client.query(SQL, [username, password, email, isAdmin, favorite_number]);
  return response.rows[0];
};

//deleteUser is going to delete a user from the database
deleteUser = async(id)=> {
  const SQL = `
    DELETE FROM users WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};


/*MORE RELEVERANT TO TIER 1*/

//need to make a createProducts function that takes in a product object and adds it to the database
createProducts = async({ name, description, price, category, rating, imageUrl })=> {
  const SQL = `
    INSERT INTO products(id, name, description, price, category, rating, imageUrl) 
    VALUES($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, description, price, category, rating, imageUrl]);
  return response.rows[0];
};

//need to make a getProducts function that returns all products from the database
getProducts = async()=> {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//Want to make a getLimitedProducts function that returns a limited amount of products from the database
getLimitedProducts = async()=> {
  const SQL = `
    SELECT * FROM products LIMIT 10;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//need to make a getSingleProduct function that takes in a product.id from the database and returns on a screen with the info on that product
getSingleProduct = async(id)=> {
  const SQL =``;
  await client.query(SQL);
};

//want to make an updateProduct function that updates a product in the database incase
updateProduct = async({ name, description, price, category, rating, imageUrl })=> {
  const SQL = `
    UPDATE products
    SET name=$1, description=$2, price=$3, category=$4, rating=$5, imageUrl=$6
    WHERE id=$7
    RETURNING *
  `;
  const response = await client.query(SQL, [name, description, price, category, rating, imageUrl]);
  return response.rows[0];
}

//want to make a deleteProduct function that deletes a product from the database incase
deleteProduct = async(id)=> {
  const SQL = `
    DELETE FROM products WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};

//want to make a getCategories function that returns all the categories from the database
getCategories = async()=> {
  const SQL = `
    SELECT * FROM categories;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//Want to make a get single category function that returns all the products from a single category
getSingleCategory = async(id)=> {
  const SQL = `
    SELECT * FROM categories WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

//Want to make a funtion that returns all the carts from the database. only the admin should be able to see this
getAllCarts = async()=> {
  const SQL = `
    SELECT * FROM carts;
  `;
  const response = await client.query(SQL);
  return response.rows;
};


//need to make a createCart function that creates a cart for a user, might need to add the date to the cart
createCart = async(userId)=> {
  const SQL = `
    INSERT INTO carts(id, userId) 
    VALUES($1, $2) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), userId]);
  return response.rows[0];
};

//need to make a getCart function that would retrieve a users cart based on the user.id
getCart = async(userId)=> {
  const SQL = `
    SELECT * FROM carts WHERE userId=$1;
  `;
  const response = await client.query(SQL, [userId]);
  return response.rows;
}

//need to make a updateCart function that would update a users cart on the cart table
updateCart = async({ cartId, productId, quantity })=> {
  const SQL = `
    INSERT INTO cart_products(cartId, productId, quantity) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [cartId, productId, quantity]);
  return response.rows[0];
};

//need to make a deleteCart function that would delete a users cart from the cart table
deleteCart = async(cartId)=> {
  const SQL = `
    DELETE FROM carts WHERE id=$1;
  `;
  await client.query(SQL, [cartId]);

  const SQL2 = `
    DELETE FROM cart_products WHERE cartId=$1;
  `;
  await client.query(SQL2, [cartId]);

};

/*MORE RELEVERANT TO TIER 2*/

//need to make a createOrder function that would create an order for a user
createOrder = async(userId)=> {
  const SQL = `
    INSERT INTO orders(id, userId) 
    VALUES($1, $2) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), userId]);
  return response.rows[0];
};

//need to make a getOrders function that would retrieve a users orders based on the user.id
getOrders = async(userId)=> {
  const SQL = `
    SELECT * FROM orders WHERE userId=$1;
  `;
  const response = await client.query(SQL, [userId]);
  return response.rows;
};

//need to make a createReview function that would create a review for a product
createReview = async({ productId, userId, review })=> {
  const SQL = `
    INSERT INTO reviews(id, productId, userId, review) 
    VALUES($1, $2, $3, $4) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), productId, userId, review]);
  return response.rows[0];
};

//need to make a getReviews function that would retrieve a products reviews based on the product.id
getReviews = async(productId)=> {
  const SQL = `
    SELECT * FROM reviews WHERE productId=$1;
  `;
  const response = await client.query(SQL, [productId]);
  return response.rows;
};

//a list of all reviews a user has made
getUsersReviews = async(userId)=> {
  const SQL = `
    SELECT * FROM reviews WHERE userId=$1;
  `;
  const response = await client.query(SQL, [userId]);
  return response.rows;
};

//delete a review
deleteReview = async(id)=> {
  const SQL = `
    DELETE FROM reviews WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};

//retrieve the users info for the account page
getUserAccountInfo = async()=> {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//retrieve the users orders for the account page
getUserOrders = async()=> {
  const SQL = `
    SELECT * FROM orders;
  `;
  const response = await client.query(SQL);
  return response.rows;
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
  getUserOrders
};