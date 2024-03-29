import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    login(username, password)
      .then(() => {
        navigate('/home'); 
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button type="submit">Login</button>
      <Link to="/register">Register</Link>
    </form>
  );
}