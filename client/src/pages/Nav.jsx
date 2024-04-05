import { Link } from 'react-router-dom';

const Nav = ({ auth, logout }) => {
  return (
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/register">Register</Link>
      {auth.id && <Link to="/cart">Cart</Link>}
      {auth.id ? (
        <>
          <Link to="/user">User</Link>
          <button onClick={logout}>Logout {auth.username}</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Nav;