/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';

const User = ({ auth }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = window.localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            authorization: token,
          },
        });
        const json = await response.json();
        if (response.ok) {
          setUser(json);
        } else {
          window.localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div>
      <h1>User</h1>
      <h2>Welcome {user.username}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default User;