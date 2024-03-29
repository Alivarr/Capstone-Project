/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ user }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchCartItems() {
            if (user) {
                try {
                    const response = await axios.get(`/api/cart/${user.id}`);
                    setItems(response.data);
                } catch (error) {
                    console.error('Failed to fetch cart items:', error);
                }
            } else {
                const localItems = JSON.parse(localStorage.getItem('cart')) || [];
                setItems(localItems);
            }
        }

        fetchCartItems();
    }, [user]);

    const handleRemove = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const handleClear = () => {
        // Clear the cart
        setItems([]);
    };

    const handleQuantityChange = (itemId, quantity) => {
        setItems(items.map(item => item.id === itemId ? { ...item, quantity } : item));
    };

    return (
        <div>
            <h2>Cart</h2>
            {items.map((item) => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>
                    <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, e.target.value)} />
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                </div>
            ))}
            <button onClick={handleClear}>Clear Cart</button>
        </div>
    );
};

export default Cart;