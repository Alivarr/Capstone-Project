import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = ({ auth }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get('http://localhost:3000/api/cart');
      setCart(response.data);
      setTotal(response.data.reduce((acc, product) => acc + product.price, 0));
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    const response = await axios.delete(`http://localhost:3000/api/cart/${productId}`);
    if (response.status === 200) {
      setCart(cart.filter((product) => product.product_id !== productId));
      setTotal(cart.reduce((acc, product) => acc + product.price, 0));
    }
  };

  const handleCheckout = async () => {
    // Checkout logic here
  };

  const handleClearCart = async () => {
    // Clear cart logic here

    const response = await axios.delete('http://localhost:3000/api/cart');
    if (response.status === 200) {
      setCart([]);
      setTotal(0);
    }

    navigate('/products');
  };

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.map((product) => (
          <li key={product.product_id}>
            <h2>{product.product_name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <img src={product.imageUrl} alt={product.product_name} />
            <button onClick={() => handleRemoveFromCart(product.product_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: {total}</p>
      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={handleClearCart}>Clear Cart</button>
    </div>
  );
};

export default Cart;