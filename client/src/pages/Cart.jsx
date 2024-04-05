/* eslint-disable no-unused-vars */
import { useState } from 'react';
import CheckoutForm from './CheckoutForm';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleCheckout = async () => {
    const response = await fetch('/api/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });

    const data = await response.json();
    console.log(data);
  };
  
  return (
    <div>
      {cartItems.map((item, index) => (
        <div key={index}>
          <h2>{item.product_name}</h2>
          <p>{item.description}</p>
          <p>{item.price}</p>
          <img src={item.imageUrl} alt={item.product_name} />
        </div>
      ))}
      <button onClick={handleCheckout}>Checkout</button>
      <CheckoutForm cartItems={cartItems} />
    </div>
  );
};

export default Cart;