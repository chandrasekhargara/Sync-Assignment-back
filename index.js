const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Dummy user
const user = { username: 'test', password: '1234' };

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'User not logged in' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, userData) => {
    if (err) return res.status(403).json({ message: 'User not logged in' });
    req.user = userData;
    next();
  });
};

// Dashboard API
app.get('/dashboard', authenticate, (req, res) => {
    const cards = [
      { id: "1", name: "📍 My Current Location" },
      { id: "2", name: "🏛️ Delhi - Capital City" },
      { id: "3", name: "💻 Bengaluru - Tech Hub" }
    ];
    
    res.json({ cards });
  });
  

// Map View API
app.get('/map', authenticate, (req, res) => {
  res.json({ message: 'Map data for India view' });
});
app.get("/", (req, res) => {
  res.send("Welcome to the backend API. Use /login, /dashboard, or /map.");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
