import {useState, useEffect} from 'react';

export default function useAuth() {
    const [auth, setAuth] = useState({});



    const attemptLoginWithToken = async()=> {
        const token = window.localStorage.getItem('token');
        if(token){
            const response = await fetch(`/api/auth/me`, {
                headers: {
                    authorization: token
                }
            });
            const json = await response.json();
            if(response.ok){
                setAuth(json);
            }
            else {
                window.localStorage.removeItem('token');
            }
        }
    };

    const login = async(credentials)=> {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        if(response.ok){
            window.localStorage.setItem('token', json.token);
            attemptLoginWithToken();
        }
    };

    const logout = ()=> {
        window.localStorage.removeItem('token');
        setAuth({});
    };

    useEffect(()=> {
        attemptLoginWithToken();
    }, []);

    return { auth, login, logout };
}