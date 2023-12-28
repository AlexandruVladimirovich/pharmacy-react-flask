import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering((prevIsRegistering) => !prevIsRegistering);
  };

  return (
    <div className='login'>
      {isRegistering ? (
        <>
          <RegistrationForm />
          <div className='toggle-wrapper'>
            <p>Already have an account?</p>
            <button onClick={toggleForm}>Login</button>
          </div>
        </>
      ) : (
        <>
          <LoginForm />
          <div className='toggle-wrapper'>
            <p>Don't have an account yet?</p>
            <button onClick={toggleForm}>Register</button>
          </div>
        </>
      )}
    </div>
  );
}
