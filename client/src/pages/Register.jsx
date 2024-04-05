/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/users', { username, password, email });
      const { token, user } = response.data;
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('user', JSON.stringify(user));
        alert('Registration successful! Now redirecting to the home page...');
        setTimeout(() => setRedirect(true), 2000);
    }
    catch (error) {
      console.error('Failed to register:', error);
    }
    }

    if (redirect) {
        return <Navigate to='/' />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
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
            <label>
                Email
                <input
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </label>
            <button type='submit'>Register</button>
        </form>
    );
}

export default Register;