import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const RegistrationForm = ({ onRegister, onError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    const userData = { username, password, firstName, lastName };
    
    if (password.length < 6) {
      message.warning('The password must be at least 6 characters long.');
      return;
    }

    if (password !== repeatPassword) {
      message.warning("Passwords don't match");
      return;
    }

    axios.post('http://127.0.0.1:5000/register', userData)
      .then(response => {
        console.log(response.data);
        message.success('Вы успешно зарегистрировались!');
        if (onRegister) {
          onRegister(userData);
        }

        setUsername('');
        setPassword('');
        setRepeatPassword('');
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
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}  />
      </div>
      <div className='login-form_block'>
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
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
      </div>
      <div className='login-form_block'>
        <label>Repeat Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </div>
      {showPassword ? (
        <p onClick={() => setShowPassword(false)}>Hide password </p>
      ) : (
        <p onClick={() => setShowPassword(true)}>Show password </p>
      )}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegistrationForm;
