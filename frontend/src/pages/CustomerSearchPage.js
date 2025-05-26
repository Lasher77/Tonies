import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper
} from '@mui/material';
import { fetchCustomers } from '../api';

function CustomerSearchPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Kunden
      </Typography>
      
      {/* Suchfeld */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Suche nach Namen oder E-Mail"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
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
    </Box>
  );
}

export default CustomerSearchPage;

