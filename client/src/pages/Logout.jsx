/* eslint-disable no-unused-vars */
import React from 'react';
import Nav from './Nav';
import useAuth from './useAuth';

export default function Logout() {
    const { logout } = useAuth();

    return (
        <div>
            <h1>Logout</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
