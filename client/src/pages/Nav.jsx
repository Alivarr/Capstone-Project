/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ auth }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='sidebar'>
      {isOpen && (
        <nav className={isOpen ? 'open' : ''}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/items">Items</Link></li>
          {!auth ? (
            <Link to="/user">User</Link>
          ) : (
            <Link to="/">login</Link>
          )}
        </nav>
      )}
       <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Nav;