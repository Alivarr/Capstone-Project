/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


import Home from './pages/Home';
import Items from './pages/Items';
import Cart from './pages/Cart';
import User from './pages/User';
import Nav from './pages/Nav';
import LogReg from './pages/LogReg';

const stripePromise = loadStripe('pk_test_51P1xxdRtrA9vWRxferYJpecA2yHKCBzGW9HQmy17gCnGPPETiKABpwHNfS4wWn29vJWmrns9UZOQlyJw7aNzsyEF00V1gnLNri');

const login = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const { token } = await response.json();
      window.localStorage.setItem('token', token);
      alert('Logged in!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      console.error('Login failed', response);
    }
  }
  catch (error) {
    console.error('Login failed', error);
  }
}

const register = async (username, password, email) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (response.ok) {
    const { token } = await response.json();
    window.localStorage.setItem('token', token);
    alert('Account created!');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } else {
    console.error('Registration failed', response);
  }
}

const App = () => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    } else {
      setAuth({});
    }
  }, []);


  return (
    <Elements stripe={stripePromise}>
      <div id='navbarr'>
        {auth.token ? <LogReg auth={auth} /> : <LogReg login={login} register={register} />}

        <Nav auth={auth} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/items" element={<Items />} />
          <Route path="/user" element={<User />} />
          <Route path="/logreg" element={<LogReg />} />
        </Routes>
      </div>
    </Elements>
  );
};

export default App;