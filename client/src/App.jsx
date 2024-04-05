/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Register from './pages/Register';
import User from './pages/User';
import Nav from './pages/Nav';
import CheckoutForm from './pages/CheckoutForm';

const App = () => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          authorization: token,
        },
      })
        .then((response) => response.json())
        .then((user) => {
          if (user.id) {
            setAuth(user);
          } else {
            window.localStorage.removeItem('token');
          }
        });
    }
  }, []);

  
  return (
    <>

      <Nav auth={auth} />
       <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        {auth.id ? (
          <>
            <Route path="/cart" element={<Cart user={auth} />} />
            <Route path="/user" element={<User />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
};

export default App;