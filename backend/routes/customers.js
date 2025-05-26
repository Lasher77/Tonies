// routes/customers.js - Routen für Kundenverwaltung

const express = require('express');
const router = express.Router();
const customerModel = require('../models/customerModel');

// Alle Kunden abrufen
router.get('/', (req, res) => {
  customerModel.getAllCustomers((err, customers) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(customers);
  });
});

// Kunden nach ID abrufen
router.get('/:id', (req, res) => {
  const id = req.params.id;
  customerModel.getCustomerById(id, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Kunde nicht gefunden' });
    }
    res.json(customer);
  });
});

// Kunden suchen
router.get('/search/:term', (req, res) => {
  const searchTerm = req.params.term;
  customerModel.searchCustomers(searchTerm, (err, customers) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(customers);
  });
});

// Neuen Kunden erstellen
router.post('/', (req, res) => {
  const customerData = req.body;
  
  // Validierung
  if (!customerData.first_name || !customerData.last_name) {
    return res.status(400).json({ error: 'Vor- und Nachname sind erforderlich' });
  }
  
  customerModel.createCustomer(customerData, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(customer);
  });
});

// Kunden aktualisieren
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const customerData = req.body;
  
  // Validierung
  if (!customerData.first_name || !customerData.last_name) {
    return res.status(400).json({ error: 'Vor- und Nachname sind erforderlich' });
  }
  
  customerModel.updateCustomer(id, customerData, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(customer);
  });
});

// Kunden löschen
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  customerModel.deleteCustomer(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!result.deleted) {
      return res.status(404).json({ error: 'Kunde nicht gefunden' });
    }
    res.json({ message: 'Kunde erfolgreich gelöscht' });
  });
});

module.exports = router;
