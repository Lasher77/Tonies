import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import { fetchCustomersWithInvalidCompositions } from '../api';

const InvalidCompositionCustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCustomersWithInvalidCompositions();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleCustomerClick = (customerId) => {
    if (!customerId) {
      return;
    }
    navigate(`/customers/${customerId}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={24} />
          <Typography>Lade Kunden mit unvollständigen Duftmischungen...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" data-testid="invalid-customers-error">
          {error}
        </Typography>
      );
    }

    if (customers.length === 0) {
      return (
        <Typography variant="body1">
          Es wurden keine Kunden mit unvollständigen Duftzusammenstellungen gefunden.
        </Typography>
      );
    }

    return (
      <>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {customers.length}{' '}
          {customers.length === 1
            ? 'Kunde hat mindestens eine Zusammenstellung, die nicht 50 ml oder 100 ml entspricht.'
            : 'Kunden haben mindestens eine Zusammenstellung, die nicht 50 ml oder 100 ml entspricht.'}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>E-Mail</TableCell>
                <TableCell align="right">Ungültige Zusammenstellungen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.customer_id}
                  onClick={() => handleCustomerClick(customer.customer_id)}
                  sx={{
                    cursor: customer.customer_id ? 'pointer' : 'default',
                    '&:hover': customer.customer_id
                      ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      : undefined
                  }}
                >
                  <TableCell>{customer.full_name || `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()}</TableCell>
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
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Kunden mit unvollständigen Duftzusammenstellungen
      </Typography>
      {renderContent()}
    </Box>
  );
};

export default InvalidCompositionCustomersPage;
