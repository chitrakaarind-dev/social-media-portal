import React, { useEffect, useState } from 'react';
import { apiGetBrands } from './api.js';

export default function Dashboard({ token, onLogout }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetBrands(token);
        setBrands(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [token]);

  return (
    <div className="dash-container">
      <h2>Dashboard</h2>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
      <ul className="brand-list">
        {brands.map(b => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}
