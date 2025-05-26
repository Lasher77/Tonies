// models/fragranceModel.js - Modell für Grunddüfte

const db = require('../database');

// Alle Grunddüfte abrufen
function getAllFragrances(callback) {
  const sql = 'SELECT * FROM fragrances ORDER BY name';
  db.all(sql, [], callback);
}

// Einen Grundduft nach ID abrufen
function getFragranceById(id, callback) {
  const sql = 'SELECT * FROM fragrances WHERE fragrance_id = ?';
  db.get(sql, [id], callback);
}

// Grunddüfte nach Name suchen
function searchFragrances(searchTerm, callback) {
  const sql = `
    SELECT * FROM fragrances 
    WHERE name LIKE ? OR description LIKE ?
    ORDER BY name
  `;
  const term = `%${searchTerm}%`;
  db.all(sql, [term, term], callback);
}

// Neuen Grundduft erstellen
function createFragrance(fragranceData, callback) {
  const { name, code, description } = fragranceData;
  const sql = `
    INSERT INTO fragrances (name, code, description)
    VALUES (?, ?, ?)
  `;
  db.run(
    sql,
    [name, code, description],
    function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...fragranceData });
    }
  );
}

// Grundduft aktualisieren
function updateFragrance(id, fragranceData, callback) {
  const { name, code, description } = fragranceData;
  const sql = `
    UPDATE fragrances
    SET name = ?, code = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE fragrance_id = ?
  `;
  db.run(
    sql,
    [name, code, description, id],
    function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id, ...fragranceData });
    }
  );
}

// Grundduft löschen
function deleteFragrance(id, callback) {
  const sql = 'DELETE FROM fragrances WHERE fragrance_id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id, deleted: this.changes > 0 });
  });
}

module.exports = {
  getAllFragrances,
  getFragranceById,
  searchFragrances,
  createFragrance,
  updateFragrance,
  deleteFragrance
};
