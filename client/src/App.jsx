/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate,  } from 'react-router-dom';
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
  const { user } = useAuth();
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/Home" />} />
      </Routes>
    </div>
  );
}

export default App;