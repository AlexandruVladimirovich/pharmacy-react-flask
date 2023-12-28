import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';


const RegistrationForm = ({ onRegister, onError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    const userData = { username, password };
    if (password.length < 6) {
      message.warning('The password must be at least 6 characters long.');
      return;
    }

    axios.post('http://127.0.0.1:5000/register', userData)
      .then(response => {
        console.log(response.data);
        message.success('Вы успешно зарегистрировались!')
        if (onRegister) {
          onRegister(userData);
        }

        setUsername('');
        setPassword('');
        setShowPassword(false); 
      })
      .catch(error => {
        console.error('Registration error:', error);
        message.error('Пользователь с таким логином уже существует.');
        if (onError) {
          onError(error);
        }
      });
  };

  return (
    <div className='login-form'>
      <h2>Registration</h2>
      <div className='login-form_block'>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className='login-form_block'>
        <label>Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {showPassword ? (
         <p onClick={() => setShowPassword(false)}>Hide password </p> 
        ) : (
          <p onClick={() => setShowPassword(true)}>Show password </p>
        )}
      </div>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegistrationForm;
