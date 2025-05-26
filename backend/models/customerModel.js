// models/customerModel.js - Modell für Kunden

const db = require("../database");

// Alle Kunden abrufen
function getAllCustomers(callback) {
  const sql = "SELECT *, first_name || ' ' || last_name AS full_name FROM customers ORDER BY last_name, first_name";
  db.all(sql, [], callback);
}

// Einen Kunden nach ID abrufen
function getCustomerById(id, callback) {
  const sql = "SELECT *, first_name || ' ' || last_name AS full_name FROM customers WHERE customer_id = ?";
  db.get(sql, [id], callback);
}

// Kunden nach Name suchen
function searchCustomers(searchTerm, callback) {
  const sql = `
    SELECT *, first_name || ' ' || last_name AS full_name FROM customers 
    WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR (first_name || ' ' || last_name) LIKE ?
    ORDER BY last_name, first_name
  `;
  const term = `%${searchTerm}%`;
  db.all(sql, [term, term, term, term], callback);
}

// Neuen Kunden erstellen
function createCustomer(customerData, callback) {
  const { first_name, last_name, email, phone, street, postal_code, city } = customerData;
  const sql = `
    INSERT INTO customers (first_name, last_name, email, phone, street, postal_code, city)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [first_name, last_name, email, phone, street, postal_code, city],
    function(err) {
      if (err) {
        return callback(err);
      }
      // Nach dem Erstellen den neuen Kunden mit full_name abrufen
      getCustomerById(this.lastID, callback);
    }
  );
}

// Kunden aktualisieren
function updateCustomer(id, customerData, callback) {
  const { first_name, last_name, email, phone, street, postal_code, city } = customerData;
  const sql = `
    UPDATE customers
    SET first_name = ?, last_name = ?, email = ?, phone = ?, 
        street = ?, postal_code = ?, city = ?, updated_at = CURRENT_TIMESTAMP
    WHERE customer_id = ?
  `;
  db.run(
    sql,
    [first_name, last_name, email, phone, street, postal_code, city, id],
    function(err) {
      if (err) {
        return callback(err);
      }
      // Nach dem Aktualisieren den Kunden mit full_name abrufen
      getCustomerById(id, callback);
    }
  );
}

// Kunden löschen
function deleteCustomer(id, callback) {
  const sql = "DELETE FROM customers WHERE customer_id = ?";
  db.run(sql, [id], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id, deleted: this.changes > 0 });
  });
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

