/* eslint-disable no-undef */
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

const Nav = ({ auth }) => {
  const [redirect, setRedirect] = useState(false);

  const logoutUser = async () => {
    try {
      await axios.post('/api/users/logout');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      setRedirect(true);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/register">Register</Link>
      {auth.id && <Link to="/cart">Cart</Link>}
      {auth.id ? (
        <>
          <Link to="/user">User</Link>
          <button onClick={logoutUser}>Logout {auth.username}</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Nav;