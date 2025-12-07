// server.js - Express-Server für die Parfümerie-Anwendung

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Environment configuration
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Routen importieren
const customerRoutes = require('./routes/customers');
const fragranceRoutes = require('./routes/fragrances');
const compositionRoutes = require('./routes/compositions');

// Express-App initialisieren
const app = express();
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // ← das ist wichtig!


// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['*'];

app.set('trust proxy', 1);

app.use(cors({
  origin: allowedOrigins.includes('*')
    ? true
    : (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Nicht erlaubte Origin'), false);
      },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API-Routen
app.use('/api/customers', customerRoutes);
app.use('/api/fragrances', fragranceRoutes);
app.use('/api/compositions', compositionRoutes);

// Basis-Route für API-Test
app.get('/api', (req, res) => {
  res.json({ message: 'Willkommen zur Parfümerie API' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

module.exports = app;
