import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper
} from '@mui/material';
import { fetchCustomers, fetchCustomersWithInvalidCompositions } from '../api';

function CustomerSearchPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [invalidCustomers, setInvalidCustomers] = useState([]);
  const [invalidLoading, setInvalidLoading] = useState(false);
  const [invalidError, setInvalidError] = useState(null);
  const [showInvalidResults, setShowInvalidResults] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomers();
        setCustomers(data || []);
      } catch (err) {
        setError(err.message);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomers();
  }, []);

  // Filterfunktion für die Suche
  const filteredCustomers = customers ? customers.filter(customer => 
    (customer.full_name && customer.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // Funktion zum Navigieren zur Kundendetailseite
  const handleCustomerClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const handleLoadInvalidCompositions = async () => {
    setShowInvalidResults(true);
    setInvalidLoading(true);
    setInvalidError(null);
    try {
      const result = await fetchCustomersWithInvalidCompositions();
      setInvalidCustomers(Array.isArray(result) ? result : []);
    } catch (err) {
      setInvalidError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setInvalidCustomers([]);
    } finally {
      setInvalidLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Kunden
      </Typography>
      
      {/* Suchfeld */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { sm: 'center' }
        }}
      >
        <TextField
          fullWidth
          label="Suche nach Namen oder E-Mail"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="text"
          size="small"
          color="inherit"
          sx={{ color: 'text.secondary' }}
          onClick={handleLoadInvalidCompositions}
          disabled={invalidLoading}
        >
          Ungültige Zusammenstellungen anzeigen
        </Button>
      </Box>
      
      {/* Kundenliste */}
      {loading ? (
        <Typography>Lade Kunden...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Vorname</TableCell>
                <TableCell>Nachname</TableCell>
                <TableCell>E-Mail</TableCell>
                <TableCell>Telefon</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow 
                  key={customer.customer_id} 
                  onClick={() => handleCustomerClick(customer.customer_id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <TableCell>{customer.customer_id}</TableCell>
                  <TableCell>{customer.first_name}</TableCell>
                  <TableCell>{customer.last_name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">Keine Kunden gefunden</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showInvalidResults && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Kunden mit ungültigen Zusammenstellungen
          </Typography>
          {invalidLoading ? (
            <Typography>Lade betroffene Kunden...</Typography>
          ) : invalidError ? (
            <Typography color="error">{invalidError}</Typography>
          ) : invalidCustomers.length > 0 ? (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {invalidCustomers.length} {invalidCustomers.length === 1 ? 'Kunde' : 'Kunden'} mit fehlerhaften Mengen gefunden.
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>E-Mail</TableCell>
                      <TableCell align="right">Anzahl fehlerhafter Zusammenstellungen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invalidCustomers.map((customer) => (
                      <TableRow
                        key={customer.customer_id}
                        onClick={() => handleCustomerClick(customer.customer_id)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                      >
                        <TableCell>{customer.full_name || `${customer.first_name} ${customer.last_name}`}</TableCell>
                        <TableCell>{customer.email || '–'}</TableCell>
                        <TableCell align="right">
                          {customer.invalid_composition_count != null
                            ? Number(customer.invalid_composition_count)
                            : '–'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant="body2">Keine Kunden mit fehlerhaften Zusammenstellungen gefunden.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default CustomerSearchPage;

