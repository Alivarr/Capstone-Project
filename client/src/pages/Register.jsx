import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./useAuth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await axios.post('http://localhost:3000/api/users', {
      username,
      password
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/users');
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
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
      <button type="submit">Register</button>
      <Link to="/login">Login</Link>
    </form>
  );
}