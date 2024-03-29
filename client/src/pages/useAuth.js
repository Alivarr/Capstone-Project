import {useState, useEffect} from 'react';

export default function useAuth() {
    const [auth, setAuth] = useState({});



    const attemptLoginWithToken = async () => {
        const token = window.localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`/api/auth/me`, {
                    headers: {
                        authorization: token
                    }
                });
                const json = await response.json();
                if (response.ok) {
                    setAuth(json);
                } else {
                    window.localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Failed to login with token:', error);
            }
        }
    };
    
    const login = async (credentials) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const json = await response.json();
            if (response.ok) {
                window.localStorage.setItem('token', json.token);
                await attemptLoginWithToken();
                return true;
            }
        } catch (error) {
            console.error('Failed to login:', error);
        }
        return false;
    };
    const logout = ()=> {
        window.localStorage.removeItem('token');
        setAuth(null);
    };

    useEffect(()=> {
        attemptLoginWithToken();
    }, []);

    return { auth, login, logout };
}