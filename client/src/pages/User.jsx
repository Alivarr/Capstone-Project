/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51J0v5wGg0Q4Kv9X9g1jGJZQa0g6v4n8L0l2Y7y6ZzY9Z3X7GzGt9XH6B1q7I2RQ6hXm6lX2H0fJ7e3r2s8G1aVQ00RwVw0jB1');

const User = ({ auth }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if(response.ok) {
        const data = await response.json();
        setUser(data);
      }
    }

    fetchUser();
  }, [auth.token]);

  if(!auth.token) {
    return <Navigate to="/login" />;
  }

  if(!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Elements stripe={stripePromise}>
        <CheckoutForm user={user} />
      </Elements>
    </div>
  );
};

export default User;