/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import './index.css';
import Login from './pages/Login';
import useAuth from './pages/useAuth';

function App() {
  const { auth, login, logout, attemptLoginWithToken } = useAuth();

  useEffect(() => {
    attemptLoginWithToken();
  }, [attemptLoginWithToken]);

  return (
    <>
      {!auth.id ? (
        <Login login={login} />
      ) : (
        <button onClick={logout}>Logout {auth.username}</button>
      )}
      {!!auth.id && (
        <nav>
          <Link to="/">Home</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
      )}
      {!!auth.id && (
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/faq" element={<h1>FAQ</h1>} />
        </Routes>
      )}
    </>
  );
}

export default App;