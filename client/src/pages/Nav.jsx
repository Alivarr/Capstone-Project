/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Link } from 'react-router-dom';

const Nav = ({ auth }) => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {auth.token ? (
        <>
          <Link to="/user">User</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
          <button onClick={auth.logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Nav;