/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Home from './pages/Home';
import Cart from './pages/Cart';
import Products from './pages/Products';
import User from './pages/User';
import Nav from './pages/Nav';
import CheckoutForm from './pages/CheckoutForm';

const stripePromise = loadStripe('pk_test_51J0v5wGg0Q4Kv9X9g1jGJZQa0g6v4n8L0l2Y7y6ZzY9Z3X7GzGt9XH6B1q7I2RQ6hXm6lX2H0fJ7e3r2s8G1aVQ00RwVw0jB1');

const Login = ({ login, register }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLogin) {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if(response.ok) {
        window.localStorage.setItem('token', data.token);
        attemptedLoginWithToken();
      } else {
        console.error('Login failed', data);
      }
    } else {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if(response.ok) {
        const { token } = await response.json();
        window.localStorage.setItem('token', token);
        alert('Account created!');
        setTimeout(() => {
          window.location.href = '/';
        } , 1000);
      } else {
        console.error('Registration failed', response);
      }
    }
  }

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {!isLogin && <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Need to register?' : 'Already have an account?'}</button>
    </div>
  );
}

const App = () => {
  const [auth, setAuth] = useState({});

  const login = async (username, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if(response.ok) {
      window.localStorage.setItem('token', data.token);
      attemptedLoginWithToken();
    } else {
      console.error('Login failed', data);
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

    if(response.ok) {
      const { token } = await response.json();
      window.localStorage.setItem('token', token);
      attemptedLoginWithToken();
    } else {
      console.error('Registration failed', response);
    }
  }

  const logout = () => {
    window.localStorage.removeItem('token');
    setAuth({});
  };

  return (
    <>
      {!auth.id ? <Login login={login} register={register} /> : <button onClick={logout}>Logout</button>}
      <Nav auth={auth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/user" element={<User />} />
        <Route path="/checkout" element={<Elements stripe={stripePromise}><CheckoutForm /></Elements>} />
   </Routes>
    </>
  );
};

export default App;