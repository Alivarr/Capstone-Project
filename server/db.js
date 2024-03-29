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
    CREATE TABLE IF NOT EXISTS users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      firstName VARCHAR(100),
      lastName VARCHAR(100),
      isAdmin BOOLEAN,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      favorite_number INTEGER
    );

  
    CREATE TABLE IF NOT EXISTS categories(
      category_id UUID PRIMARY KEY,
      name VARCHAR(20) UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS products(
      product_id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      price DECIMAL(10, 2),
      category UUID REFERENCES categories(category_id),
      stock INTEGER,
      rating DECIMAL(2, 1),
      imageUrl VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS carts(
      carts_id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id) ON DELETE CASCADE,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE IF NOT EXISTS cart_products(
      cartId UUID REFERENCES carts(carts_id),
      productId UUID REFERENCES products(product_id),
      quantity INTEGER,
      PRIMARY KEY (cartId, productId)
    );
  
    CREATE TABLE IF NOT EXISTS orders(
      order_id UUID PRIMARY KEY,
      userId UUID REFERENCES users(id),
      totalPrice DECIMAL(10, 2),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE IF NOT EXISTS order_products(
      orderId UUID REFERENCES orders(order_id),
      productId UUID REFERENCES products(product_id),
      quantity INTEGER,
      PRIMARY KEY (orderId, productId)
    );

    CREATE TABLE IF NOT EXISTS reviews(
      review_id UUID PRIMARY KEY,
      productId UUID REFERENCES products(product_id),
      userId UUID REFERENCES users(id),
      review TEXT
    );
   
  `;
  await client.query(SQL);
};

const eraseTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS carts CASCADE;
    DROP TABLE IF EXISTS cart_products CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS order_products CASCADE;
    DROP TABLE IF EXISTS reviews CASCADE;
  `;
  await client.query(SQL);
};

//Create user is going to take the inputed information from the user and add it to the database
const createUser = async({ username, password, email, isAdmin, favorite_number })=> {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const SQL = `
    INSERT INTO users(id, username, password, email, isAdmin, favorite_number)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `
  const response = await client.query(SQL, [uuid.v4(), username, hashedPassword, email, isAdmin, favorite_number]);
  return response.rows[0];
}

//Authenticate is going to take the inputed information from the user and check it against the database to see if it is correct
const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT * FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  const user = response.rows[0];
  if(!user){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);
  if(!match){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: user.id }, JWT);
  return token;
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
}

//fetchSingleUser is going to return a single user from the database
const fetchSingleUser = async(id)=> {
  const SQL = `
    SELECT * FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
}

//updateUser is going to update a user in the database
updateUser = async({ username, password, email, isAdmin, favorite_number, firstName, lastName })=> {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const SQL = `
    UPDATE users
    SET username=$1, password=$2, email=$3, isAdmin=$4, favorite_number=$5, firstName=$6, lastName=$7
    WHERE id=$8
    RETURNING *;
  `;
  const response = await client.query(SQL, [username, hashedPassword, email, isAdmin, favorite_number, firstName, lastName]);
  return response.rows[0];
};

//deleteUser is going to delete a user from the database
deleteUser = async(id)=> {
  const SQL = `
    DELETE FROM users WHERE id=$1;
  `;
  await client.query(SQL, [id]);
};

//loginUser is going to login a user to the database
loginUser = async({ username, password })=> {
  const SQL = `
    SELECT * FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  const user = response.rows[0];
  if(!user){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);
  if(!match){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  return user;
};

//logoutUser is going to logout a user from the database
logoutUser = async()=> {
  const SQL = `
    SELECT * FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  const user = response.rows[0];
  if(!user){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  return user;
};

/*MORE RELEVERANT TO TIER 1*/

//need to make a createProducts function that takes in a product object and adds it to the database
createProducts = async({ name, description, price, category, rating, imageUrl, stock })=> {
  const SQL = `
    INSERT INTO products(product_id, name, description, price, category, rating, imageUrl, stock) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, description, price, category, rating, imageUrl, stock]);
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
getSingleProduct = async(product_id)=> {
  const SQL = `
    SELECT * FROM products WHERE product_id=$1;
  `;
  const response = await client.query(SQL, [product_id]);
  return response.rows[0];
};

//want to make an updateProduct function that updates a product in the database incase
updateProduct = async({ name, description, price, category, rating, imageUrl })=> {
  const SQL = `
    UPDATE products
    SET name=$1, description=$2, price=$3, category=$4, rating=$5, imageUrl=$6, stock=$8
    WHERE product_id=$7
    RETURNING *
  `;
  const response = await client.query(SQL, [name, description, price, category, rating, imageUrl]);
  return response.rows[0];
}

//want to make a deleteProduct function that deletes a product from the database incase
deleteProduct = async(product_id)=> {
  const SQL = `
    DELETE FROM products WHERE product_id=$1;
  `;
  await client.query(SQL, [product_id]);
};

//want to make a getCategories function that returns all the categories from the database
getCategories = async()=> {
  const SQL = `
    SELECT * FROM categories;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//make a createCategory function that creates a category for a product
createCategory = async({ name, description })=> {
  const existingCategory = await checkCategoryExists(name);
  if (existingCategory) {
    throw new Error('Category with this name already exists');
  }

  const SQL = `
    INSERT INTO categories(category_id, name, description) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, description]);
  return response.rows[0];
};

//Want to make a get single category function that returns all the products from a single category
getSingleCategory = async(category_id)=> {
  const SQL = `
    SELECT * FROM categories WHERE category_id=$1;
  `;
  const response = await client.query(SQL, [category_id]);
  return response.rows[0];
};

//want to make an updateCategory function that updates a category in the database incase
updateCategory = async({ name, description })=> {
  const SQL = `
    UPDATE categories
    SET name=$1, description=$2
    WHERE category_id=$3
    RETURNING *
  `;
  const response = await client.query(SQL, [name, description]);
  return response.rows[0];
}

//want to make a deleteCategory function that deletes a category from the database incase
deleteCategory = async(category_id)=> {
  const SQL = `
    DELETE FROM categories WHERE category_id=$1;
  `;
  await client.query(SQL, [category_id]);
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
    INSERT INTO carts(cart_id, userId) 
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

//cart_products

//get all cart products
getCartProducts = async()=> {
  const SQL = `
    SELECT * FROM cart_products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//add a product to a cart
addProductToCart = async({ cartId, productId, quantity })=> {
  const SQL = `
    INSERT INTO cart_products(cartId, productId, quantity) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [cartId, productId, quantity]);
  return response.rows[0];
};

//delete a product from a cart
deleteProductFromCart = async({ cartId, productId })=> {
  const SQL = `
    DELETE FROM cart_products WHERE cartId=$1 AND productId=$2;
  `;
  await client.query(SQL, [cartId, productId]);
};

//check if exists

//check if a user exists
const checkUserExists = async(username)=> {
  const SQL = `
    SELECT * FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  return response.rows[0];
};

//check if a product exists
const checkProductExists = async(name)=> {
  const SQL = `
    SELECT * FROM products WHERE name=$1;
  `;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
};

//check if a category exists
const checkCategoryExists = async(name)=> {
  const SQL = `
    SELECT * FROM categories WHERE name=$1;
  `;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
};

//check if a review exists
const checkReviewExists = async(review)=> {
  const SQL = `
    SELECT * FROM reviews WHERE review=$1;
  `;
  const response = await client.query(SQL, [review]);
  return response.rows[0];
};

//check if a cart exists
const checkCartExists = async(userId)=> {
  const SQL = `
    SELECT * FROM carts WHERE userId=$1;
  `;
  const response = await client.query(SQL, [userId]);
  return response.rows[0];
};

//check if an order exists
const checkOrderExists = async(userId)=> {
  const SQL = `
    SELECT * FROM orders WHERE userId=$1;
  `;
  const response = await client.query(SQL, [userId]);
  return response.rows[0];
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
  checkOrderExists,
  loginUser,
  logoutUser
};