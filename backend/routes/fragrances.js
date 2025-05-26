// routes/fragrances.js - Routen für Grunddüfte

const express = require('express');
const router = express.Router();
const fragranceModel = require('../models/fragranceModel');

// Alle Grunddüfte abrufen
router.get('/', (req, res) => {
  fragranceModel.getAllFragrances((err, fragrances) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(fragrances);
  });
});

// Grundduft nach ID abrufen
router.get('/:id', (req, res) => {
  const id = req.params.id;
  fragranceModel.getFragranceById(id, (err, fragrance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!fragrance) {
      return res.status(404).json({ error: 'Grundduft nicht gefunden' });
    }
    res.json(fragrance);
  });
});

// Grunddüfte suchen
router.get('/search/:term', (req, res) => {
  const searchTerm = req.params.term;
  fragranceModel.searchFragrances(searchTerm, (err, fragrances) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(fragrances);
  });
});

// Neuen Grundduft erstellen
router.post('/', (req, res) => {
  const fragranceData = req.body;
  
  // Validierung
  if (!fragranceData.name || !fragranceData.code) {
    return res.status(400).json({ error: 'Name und Code sind erforderlich' });
  }
  
  fragranceModel.createFragrance(fragranceData, (err, fragrance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(fragrance);
  });
});

// Grundduft aktualisieren
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const fragranceData = req.body;
  
  // Validierung
  if (!fragranceData.name || !fragranceData.code) {
    return res.status(400).json({ error: 'Name und Code sind erforderlich' });
  }
  
  fragranceModel.updateFragrance(id, fragranceData, (err, fragrance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(fragrance);
  });
});

// Grundduft löschen
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  fragranceModel.deleteFragrance(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!result.deleted) {
      return res.status(404).json({ error: 'Grundduft nicht gefunden' });
    }
    res.json({ message: 'Grundduft erfolgreich gelöscht' });
  });
});

module.exports = router;
