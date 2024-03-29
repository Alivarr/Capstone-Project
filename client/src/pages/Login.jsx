import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from './useAuth';

export default function Login() {
    const [credentials, setCredentials] = useState({});
    const { login } = useAuth();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(credentials);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username
                <input type="text" name="username" onChange={handleChange} />
            </label>
            <label>
                Password
                <input type="password" name="password" onChange={handleChange} />
            </label>
            <button type="submit">Login</button>
            <Link to="/register">Register</Link>
        </form>
    );
}