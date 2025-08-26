import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';

const app = express();
app.use(express.json());

// simple json db
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { users: [], brands: [] });
await db.read();
await db.write();

const JWT_SECRET = 'change_this_secret';

function generateToken(user) {
  return jwt.sign({ id: user.id, type: user.type, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// register user
app.post('/auth/register', async (req, res) => {
  const { email, password, type, role, brandId } = req.body;
  if (!email || !password || !type || !role) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const existing = db.data.users.find(u => u.email === email);
  if (existing) return res.status(400).json({ error: 'Email exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), email, password: hashed, type, role, brands: [] };
  if (type === 'client' && brandId) {
    user.brands = [brandId];
  }
  db.data.users.push(user);
  await db.write();
  res.json({ token: generateToken(user) });
});

// login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ token: generateToken(user) });
});

// list brands accessible to user
app.get('/brands', authMiddleware, (req, res) => {
  if (req.user.type === 'agency') {
    res.json(db.data.brands);
  } else {
    const brands = db.data.brands.filter(b => req.user && b.clients && b.clients.includes(req.user.id));
    res.json(brands);
  }
});

// create brand (agency only)
app.post('/brands', authMiddleware, (req, res) => {
  if (req.user.type !== 'agency') {
    return res.status(403).json({ error: 'Only agency can create brands' });
  }
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  const brand = { id: nanoid(), name, clients: [] };
  db.data.brands.push(brand);
  db.write();
  res.json(brand);
});

// assign client to brand (agency only)
app.post('/brands/:id/assign', authMiddleware, (req, res) => {
  if (req.user.type !== 'agency') return res.status(403).json({ error: 'Only agency can assign' });
  const { clientId } = req.body;
  const brand = db.data.brands.find(b => b.id === req.params.id);
  const client = db.data.users.find(u => u.id === clientId && u.type === 'client');
  if (!brand || !client) return res.status(404).json({ error: 'Not found' });
  brand.clients.push(client.id);
  client.brands.push(brand.id);
  db.write();
  res.json({ message: 'assigned' });
});

app.listen(3000, () => console.log('Backend listening on 3000'));
