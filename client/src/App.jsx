/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './pages/useAuth';

import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Register from './pages/Register';
import User from './pages/User';
import Logout from './pages/Logout';
import Nav from './pages/Nav';

function App() {
  const { auth } = useAuth();

  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={auth ? <Navigate to="/user" /> : <Login />} />
        <Route path="/register" element={auth ? <Navigate to="/user" /> : <Register />} />
        <Route path="/user" element={!auth ? <Navigate to="/login" /> : <User />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={!auth ? <Navigate to="/login" /> : <Cart />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;