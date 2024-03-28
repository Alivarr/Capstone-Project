import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(null);
  
    useEffect(() => {
        fetch('/api/cart')
          .then(response => response.json())
          .then(data => {
            setCart(data.cart);
            setTotal(data.total);
          });
      }, []);
    
      return (
        <div>
          <h1>Cart</h1>
          {cart && cart.map(item => (
            <div key={item.id}>
              <p>Product: {item.product}</p>
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
          <h2>Total: {total}</h2>
        </div>
      );
    }