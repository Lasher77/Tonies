// routes/compositions.js - Routen für Parfum-Zusammenstellungen

const express = require('express');
const router = express.Router();
const compositionModel = require('../models/compositionModel');
const db = require('../database');

// Alle Zusammenstellungen abrufen
router.get('/', (req, res) => {
  compositionModel.getAllCompositions((err, compositions) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(compositions);
  });
});

// Zusammenstellungen eines Kunden abrufen
router.get('/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  compositionModel.getCompositionsByCustomerId(customerId, (err, compositions) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(compositions);
  });
});

// Zusammenstellung nach ID abrufen
router.get('/:id', (req, res) => {
  const id = req.params.id;
  compositionModel.getCompositionById(id, (err, composition) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!composition) {
      return res.status(404).json({ error: 'Zusammenstellung nicht gefunden' });
    }
    
    // Details der Zusammenstellung abrufen
    compositionModel.getCompositionDetails(id, (err, details) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      composition.details = details;
      res.json(composition);
    });
  });
});

// Details einer Zusammenstellung abrufen
router.get('/:id/details', (req, res) => {
  try {
    const compositionId = req.params.id;
    
    // Für sqlite3
    db.all(
      'SELECT * FROM composition_details WHERE composition_id = ?',
      [compositionId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(rows);
      }
    );
    
    // Beachten Sie: Hier ist kein return oder res.json außerhalb des Callbacks,
    // da die Antwort bereits im Callback gesendet wird
  } catch (err) {
    console.error('Fehler beim Abrufen der Zusammenstellungsdetails:', err);
    res.status(500).json({ error: err.message });
  }
});

// Neue Zusammenstellung erstellen
router.post('/', (req, res) => {
  const compositionData = req.body;
  
  // Validierung
  if (!compositionData.customer_id || !compositionData.total_amount) {
    return res.status(400).json({ error: 'Kunden-ID und Gesamtmenge sind erforderlich' });
  }
  
  compositionModel.createComposition(compositionData, (err, composition) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(composition);
  });
});

// Zusammenstellung aktualisieren
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const compositionData = req.body;
  
  // Validierung
  if (!compositionData.total_amount) {
    return res.status(400).json({ error: 'Gesamtmenge ist erforderlich' });
  }
  
  compositionModel.updateComposition(id, compositionData, (err, composition) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(composition);
  });
});

// Zusammenstellung löschen
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  compositionModel.deleteComposition(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!result.deleted) {
      return res.status(404).json({ error: 'Zusammenstellung nicht gefunden' });
    }
    res.json({ message: 'Zusammenstellung erfolgreich gelöscht' });
  });
});

// Detail zu einer Zusammenstellung hinzufügen
router.post('/:id/details', (req, res) => {
  const compositionId = req.params.id;
  const detailData = req.body;
  
  // Validierung
  if (!detailData.fragrance_id || !detailData.amount) {
    return res.status(400).json({ error: 'Duft-ID und Menge sind erforderlich' });
  }
  
  compositionModel.addCompositionDetail(compositionId, detailData, (err, detail) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(detail);
  });
});

// Detail einer Zusammenstellung aktualisieren
router.put('/details/:detailId', (req, res) => {
  const detailId = req.params.detailId;
  const detailData = req.body;
  
  // Validierung
  if (!detailData.amount) {
    return res.status(400).json({ error: 'Menge ist erforderlich' });
  }
  
  compositionModel.updateCompositionDetail(detailId, detailData, (err, detail) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(detail);
  });
});

// Detail einer Zusammenstellung löschen
router.delete('/details/:detailId', (req, res) => {
  const detailId = req.params.detailId;
  compositionModel.deleteCompositionDetail(detailId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!result.deleted) {
      return res.status(404).json({ error: 'Detail nicht gefunden' });
    }
    res.json({ message: 'Detail erfolgreich gelöscht' });
  });
});

module.exports = router;
