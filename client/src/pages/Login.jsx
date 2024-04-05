/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Login = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('/api/auth', { email, password });
      const { token, user } = response.data;
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(user));
      alert('Login successful! Now redirecting to the home page...');
      setTimeout(() => setRedirect(true), 2000);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(email, password);
  }

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>
        Email
        <input
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type='password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button type='submit'>Login</button>
    </form>
  );
}

export default Login;