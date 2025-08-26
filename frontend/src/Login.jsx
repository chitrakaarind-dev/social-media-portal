import React, { useState } from 'react';
import { apiLogin, apiRegister } from './api.js';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('agency');
  const [role, setRole] = useState('admin');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token;
      if (isRegister) {
        token = await apiRegister({ email, password, type, role });
      } else {
        token = await apiLogin({ email, password });
      }
      onLogin(token);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {isRegister && (
          <>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="agency">Agency</option>
              <option value="client">Client</option>
            </select>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
          </>
        )}
        <button type="submit">Submit</button>
      </form>
      <button className="toggle-btn" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Have an account? Login' : 'No account? Register'}
      </button>
    </div>
  );
}
