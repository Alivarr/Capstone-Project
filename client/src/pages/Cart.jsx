/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from './useAuth';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get(`http://localhost:3000/api/cart/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCart(response.data);
    };

    if (user) {
      fetchCart();
    }
  }, [user]);

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.product_id}>
            {item.product_name} - {item.quantity}
          </li>
        ))}
      </ul>
      <Link to='/products'>Back to Products</Link>
    </div>
  );
};

export default Cart;