// server.js - Express-Server für die Parfümerie-Anwendung

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

// Environment configuration
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Routen importieren
const customerRoutes = require('./routes/customers');
const fragranceRoutes = require('./routes/fragrances');
const compositionRoutes = require('./routes/compositions');

// Express-App initialisieren
const app = express();
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

// HTTP-Server mit Keep-Alive-Einstellungen für Cloudflare-Tunnel
const server = http.createServer(app);
server.keepAliveTimeout = 65000; // Höher als Cloudflare's 60s Timeout
server.headersTimeout = 66000;   // Etwas höher als keepAliveTimeout


// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['*'];

app.set('trust proxy', 1);

// Request-Logging für Debugging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path} | ${res.statusCode} | ${duration}ms`);
  });
  next();
});

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

// Health-Check-Endpunkt für Cloudflare-Tunnel-Monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Statische Frontend-Dateien ausliefern (Production)
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));

// Alle anderen Routen an das Frontend weiterleiten (für React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Server starten mit Keep-Alive-Einstellungen
server.listen(PORT, HOST, () => {
  console.log(`Server läuft auf http://${HOST}:${PORT}`);
  console.log(`Frontend wird ausgeliefert von: ${frontendBuildPath}`);
});

module.exports = app;
