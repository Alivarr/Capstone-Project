/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from './useAuth';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function getCart() {
      const response = await axios.get('http://localhost:3000/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCart(response.data);
    }

    getCart();
  }, []);

  useEffect(() => {
    async function getProducts() {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    }

    getProducts();
  }, []);

  async function handleAddProduct(event) {
    event.preventDefault();
    const productId = event.target.productId.value;
    const product = products.find((product) => product.product_id === productId);
    const cartId = cart.carts_id;
    const response = await axios.post('http://localhost:3000/api/cart/products', {
      cartId,
      productId,
      quantity,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status === 200) {
      alert(`Added ${quantity} ${product.product_name} to cart`);
    }
  }

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.products && cart.products.map((product) => (
          <li key={product.product_id}>
            {product.product_name} - {product.quantity}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddProduct}>
        <select name='productId'>
          {products.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.product_name}
            </option>
          ))}
        </select>
        <input
          type='number'
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        <button type='submit'>Add to Cart</button>
      </form>
      <Link to='/products'>Back to Products</Link>
    </div>
  );
}

