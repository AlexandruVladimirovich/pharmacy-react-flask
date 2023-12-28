import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { message } from 'antd';
import { jwtDecode } from "jwt-decode";



const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin } = useAuth();

  const handleLogin = () => {
    const userData = { username, password };
  
    axios
      .post('http://127.0.0.1:5000/login', userData)
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', response.data.token);
        const decodedToken = jwtDecode(token);
        const { role, firstName } = decodedToken;
  
        onLogin(token, role, firstName); 
  
        setUsername('');
        setPassword('');
  
        const successMessage = role === 'admin'
          ? 'You have successfully logged in as an administrator.'
          : 'You have successfully logged in!';
  
        message.success(successMessage);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          message.warning('Invalid login or password.');
        } else {
          console.error('Login error:', error);
          message.error('An error occurred while logging in.');
        }
      });
  };
  

  return (
    <div className='login-form'>
      <h2>Login</h2>
      <div className='login-form_block'>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className='login-form_block'>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;