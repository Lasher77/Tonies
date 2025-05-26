// database.js - Datenbankverbindung und Initialisierung

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Pfad zur Datenbank-Datei
const dbPath = path.resolve(__dirname, 'db/parfumerie.db');

// Stellt sicher, dass das Verzeichnis existiert
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Datenbankverbindung erstellen
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Fehler beim Verbinden zur Datenbank:', err.message);
  } else {
    console.log('Verbindung zur SQLite-Datenbank hergestellt.');
  }
});

// Aktiviere Foreign Keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
