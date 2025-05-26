// server.js - Express-Server für die Parfümerie-Anwendung

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Routen importieren
const API_BASE_URL = 'http://192.168.1.108:5001/api';
const customerRoutes = require('./routes/customers');
const fragranceRoutes = require('./routes/fragrances');
const compositionRoutes = require('./routes/compositions');

// Express-App initialisieren
const app = express();
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // ← das ist wichtig!


// Middleware
app.use(cors({
  origin: '*', // Erlaubt Zugriff von allen Domains
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
