/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./useAuth";
import { tr } from "faker/lib/locales";

const Register = ({ token, setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();


    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email }),
        });

        if (!response.ok) {
            return alert("Invalid credentials");
        }

        const { token } = await response.json();
        localStorage.setItem("token", token);
        setToken(token);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/users");
        }
    }, [token, navigate]);

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
                Email
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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

export default Register;

