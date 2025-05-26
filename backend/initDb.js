// initDb.js - Datenbank initialisieren und Schema erstellen

const fs = require('fs');
const path = require('path');
const db = require('./database');

// SQL-Schema aus Datei lesen
const schemaPath = path.resolve(__dirname, '../database_schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Schema in einzelne Anweisungen aufteilen
const statements = schema
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

// Datenbank initialisieren
function initializeDatabase() {
  console.log('Initialisiere Datenbank...');
  
  // Führe jede SQL-Anweisung aus
  db.serialize(() => {
    // Aktiviere Foreign Keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Führe jede Anweisung aus
    statements.forEach(statement => {
      db.run(`${statement};`, err => {
        if (err) {
          console.error('Fehler beim Ausführen der SQL-Anweisung:', err.message);
          console.error('Statement:', statement);
        }
      });
    });
    
    console.log('Datenbankschema erfolgreich erstellt.');
  });
}

// Führe die Initialisierung aus
initializeDatabase();

// Beispieldaten einfügen (optional)
function insertSampleData() {
  console.log('Füge Beispieldaten ein...');
  
  // Beispiel-Grunddüfte
  const fragrances = [
    { name: 'Bergamotte', code: 101, description: 'Frisch, zitrusartig, belebend' },
    { name: 'Lavendel', code: 102, description: 'Blumig, krautig, beruhigend' },
    { name: 'Sandelholz', code: 201, description: 'Holzig, warm, erdig' },
    { name: 'Rose', code: 301, description: 'Blumig, süß, romantisch' },
    { name: 'Vanille', code: 401, description: 'Süß, warm, gemütlich' }
  ];
  
  // Beispiel-Kunden
  const customers = [
    { first_name: 'Maria', last_name: 'Schmidt', email: 'maria.schmidt@example.com', phone: '030-12345678', street: 'Berliner Str. 42', postal_code: '10115', city: 'Berlin' },
    { first_name: 'Thomas', last_name: 'Müller', email: 'thomas.mueller@example.com', phone: '030-87654321', street: 'Unter den Linden 10', postal_code: '10117', city: 'Berlin' }
  ];
  
  // Füge Grunddüfte ein
  const fragranceStmt = db.prepare('INSERT INTO fragrances (name, code, description) VALUES (?, ?, ?)');
  fragrances.forEach(fragrance => {
    fragranceStmt.run([fragrance.name, fragrance.code, fragrance.description]);
  });
  fragranceStmt.finalize();
  
  // Füge Kunden ein
  const customerStmt = db.prepare('INSERT INTO customers (first_name, last_name, email, phone, street, postal_code, city) VALUES (?, ?, ?, ?, ?, ?, ?)');
  customers.forEach(customer => {
    customerStmt.run([
      customer.first_name,
      customer.last_name,
      customer.email,
      customer.phone,
      customer.street,
      customer.postal_code,
      customer.city
    ]);
  });
  customerStmt.finalize();
  
  console.log('Beispieldaten erfolgreich eingefügt.');
}

// Kommentiere die folgende Zeile ein, um Beispieldaten einzufügen
// insertSampleData();

// Schließe die Datenbankverbindung
setTimeout(() => {
  db.close(err => {
    if (err) {
      console.error('Fehler beim Schließen der Datenbank:', err.message);
    } else {
      console.log('Datenbankverbindung geschlossen.');
    }
  });
}, 1000);
