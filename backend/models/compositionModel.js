// models/compositionModel.js - Modell für Parfum-Zusammenstellungen

const db = require('../database');

// Alle Zusammenstellungen abrufen
function getAllCompositions(callback) {
  const sql = 'SELECT * FROM compositions ORDER BY created_at DESC';
  db.all(sql, [], callback);
}

// Zusammenstellungen eines Kunden abrufen
function getCompositionsByCustomerId(customerId, callback) {
  const sql = 'SELECT * FROM compositions WHERE customer_id = ? ORDER BY created_at DESC';
  db.all(sql, [customerId], callback);
}

// Eine Zusammenstellung nach ID abrufen
function getCompositionById(id, callback) {
  const sql = 'SELECT * FROM compositions WHERE composition_id = ?';
  db.get(sql, [id], callback);
}

// Details einer Zusammenstellung abrufen
function getCompositionDetails(compositionId, callback) {
  const sql = `
    SELECT cd.detail_id, cd.composition_id, cd.fragrance_id, cd.amount,
           f.name as fragrance_name, f.code as fragrance_code
    FROM composition_details cd
    JOIN fragrances f ON cd.fragrance_id = f.fragrance_id
    WHERE cd.composition_id = ?
  `;
  db.all(sql, [compositionId], callback);
}

// Neue Zusammenstellung erstellen
function createComposition(compositionData, callback) {
  const { customer_id, name, total_amount, details } = compositionData;
  
  // Transaktion starten
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Zusammenstellung einfügen
    const compositionSql = `
      INSERT INTO compositions (customer_id, name, total_amount)
      VALUES (?, ?, ?)
    `;
    
    db.run(compositionSql, [customer_id, name, total_amount], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return callback(err);
      }
      
      const compositionId = this.lastID;
      
      // Wenn keine Details vorhanden sind, Transaktion abschließen
      if (!details || details.length === 0) {
        db.run('COMMIT');
        return callback(null, { 
          id: compositionId, 
          customer_id, 
          name, 
          total_amount,
          details: []
        });
      }
      
      // Details einfügen
      const detailSql = `
        INSERT INTO composition_details (composition_id, fragrance_id, amount)
        VALUES (?, ?, ?)
      `;
      
      const detailStmt = db.prepare(detailSql);
      let detailsProcessed = 0;
      const detailsResult = [];
      
      // Jedes Detail einfügen
      details.forEach((detail, index) => {
        detailStmt.run([compositionId, detail.fragrance_id, detail.amount], function(err) {
          if (err) {
            db.run('ROLLBACK');
            detailStmt.finalize();
            return callback(err);
          }
          
          detailsResult.push({
            id: this.lastID,
            composition_id: compositionId,
            fragrance_id: detail.fragrance_id,
            amount: detail.amount
          });
          
          detailsProcessed++;
          
          // Wenn alle Details verarbeitet wurden, Transaktion abschließen
          if (detailsProcessed === details.length) {
            detailStmt.finalize();
            db.run('COMMIT');
            callback(null, { 
              id: compositionId, 
              customer_id, 
              name, 
              total_amount,
              details: detailsResult
            });
          }
        });
      });
    });
  });
}

// Zusammenstellung aktualisieren
function updateComposition(id, compositionData, callback) {
  const { name, total_amount } = compositionData;
  const sql = `
    UPDATE compositions
    SET name = ?, total_amount = ?, updated_at = CURRENT_TIMESTAMP
    WHERE composition_id = ?
  `;
  db.run(
    sql,
    [name, total_amount, id],
    function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id, ...compositionData });
    }
  );
}

// Zusammenstellung löschen
function deleteComposition(id, callback) {
  const sql = 'DELETE FROM compositions WHERE composition_id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id, deleted: this.changes > 0 });
  });
}

// Detail zu einer Zusammenstellung hinzufügen
function addCompositionDetail(compositionId, detailData, callback) {
  const { fragrance_id, amount } = detailData;
  const sql = `
    INSERT INTO composition_details (composition_id, fragrance_id, amount)
    VALUES (?, ?, ?)
  `;
  db.run(
    sql,
    [compositionId, fragrance_id, amount],
    function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, composition_id: compositionId, ...detailData });
    }
  );
}

// Detail einer Zusammenstellung aktualisieren
function updateCompositionDetail(detailId, detailData, callback) {
  const { amount } = detailData;
  const sql = `
    UPDATE composition_details
    SET amount = ?
    WHERE detail_id = ?
  `;
  db.run(
    sql,
    [amount, detailId],
    function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: detailId, ...detailData });
    }
  );
}

// Detail einer Zusammenstellung löschen
function deleteCompositionDetail(detailId, callback) {
  const sql = 'DELETE FROM composition_details WHERE detail_id = ?';
  db.run(sql, [detailId], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: detailId, deleted: this.changes > 0 });
  });
}

module.exports = {
  getAllCompositions,
  getCompositionsByCustomerId,
  getCompositionById,
  getCompositionDetails,
  createComposition,
  updateComposition,
  deleteComposition,
  addCompositionDetail,
  updateCompositionDetail,
  deleteCompositionDetail
};
