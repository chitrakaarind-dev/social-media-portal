export async function apiLogin({ email, password }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  return data.token;
}

export async function apiRegister({ email, password, type, role }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, type, role })
  });
  if (!res.ok) throw new Error('Register failed');
  const data = await res.json();
  return data.token;
}

export async function apiGetBrands(token) {
  const res = await fetch('/api/brands', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
