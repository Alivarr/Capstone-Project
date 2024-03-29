/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed BrowserRouter
import axios from 'axios';

import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Register from './pages/Register';
import User from './pages/User';
import Logout from './pages/Logout';
import useAuth from './pages/useAuth';
import Nav from './pages/Nav';

function App() {
  const auth = useAuth();

  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      </div>
  );
}

export default App;