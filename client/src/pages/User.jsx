/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {Stripe} from 'stripe';


const stripe = Stripe('pk_test_51P1xxdRtrA9vWRxferYJpecA2yHKCBzGW9HQmy17gCnGPPETiKABpwHNfS4wWn29vJWmrns9UZOQlyJw7aNzsyEF00V1gnLNri');


const User = ({ auth }) => {
  if (!auth) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Welcome, {auth.username}</h1>
      </div>
  );
}

export default User;