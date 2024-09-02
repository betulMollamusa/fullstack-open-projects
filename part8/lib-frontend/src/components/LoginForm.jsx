import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from './queries.js';  

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(LOGIN);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ variables: { username, password } });
      localStorage.setItem('token', result.data.login.value);
      alert('Login successful');
      
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
