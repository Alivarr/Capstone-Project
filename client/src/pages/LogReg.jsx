/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//login and register component

import { useState } from "react";


const LogReg = ({ login, register, auth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);



  const handleSubmit = async (event) => {
    event.preventDefault();
    if(isLogin) {
      login(username, password);
    } else {
      register(username, password, email);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    window.location.href = '/';
    alert('Logged out!');
  }

  if(auth) {
    return (
      <button onClick={handleLogout}>Logout</button>
    );
  }else {
    return (
    <div id='navbarr'>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {!isLogin && <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />}
        <button disabled={!username || !password}>{isLogin ? 'Login' : 'Register'}</button>
      <button type='button' onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'need to register?' : 'already have an account?'}</button>
      </form>
     </div>
  );
}
}

export default LogReg;