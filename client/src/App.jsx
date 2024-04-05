/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Register from './pages/Register';
import User from './pages/User';
import Nav from './pages/Nav';

const App = () => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setAuth(json);
      } else {
        window.localStorage.removeItem('token');
      }
    }
  };

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    } else {
      throw json;
    }
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    setAuth({});
  };

  return (
    <>
    {!auth.id ? (
      <>
        <Nav auth={auth} logout={logout} />
        <Login login={login} />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </>
    ) : (
      <>
        <button onClick={logout}>Logout {auth.username}</button>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/user">User</Link>
          <Link to="/logout">Logout</Link>
        </nav>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} ><Cart user={auth} /></Route>
          <Route path="/user" element={<User />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </>
    )}
    </>
  );
};

export default App;