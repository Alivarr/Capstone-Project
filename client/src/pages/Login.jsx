/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from './useAuth';

const Login = ({ token, setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            return alert('Invalid credentials');
        }

        const { token } = await response.json();
        localStorage.setItem('token', token);
        setToken(token);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/users');
        }
    }, [token, navigate]);

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label>
                Username
                <input
                    type='text'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
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
            <Link to='/register'>Register</Link>
        </form>
    );
};

export default Login;