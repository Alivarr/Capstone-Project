/* eslint-disable no-unused-vars */
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {Stripe} from 'stripe';

const Items = ({ auth }) => {
  const [items, setitems] = useState([]);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchitems = async () => {
      const response = await fetch('/api/items');
      if (response.ok) {
        const items = await response.json();
        setitems(items);
      }
    }
    fetchitems();
  }, []);

  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
const stripe = Stripe('pk_test_51P1xxdRtrA9vWRxferYJpecA2yHKCBzGW9HQmy17gCnGPPETiKABpwHNfS4wWn29vJWmrns9UZOQlyJw7aNzsyEF00V1gnLNri');
    checkoutButton.addEventListener('click', async () => {
      fetch('/create-checkout-session', {
        method: 'POST',
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
    });
  }


  return (
    <div>
      <h1>items</h1>
      {items.map(item => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <img src={item.imageUrl} alt={item.name} />
          <p>{item.description}</p>
          <p>${item.price}</p>
          <button id="checkout-button">Buy Now</button>
        </div>
      ))}
    </div>
  );
}

export default Items;