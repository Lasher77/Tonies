import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper
} from '@mui/material';
import { fetchFragrances } from '../api';

function FragranceListPage() {
  const [fragrances, setFragrances] = useState([]);  // Initialisieren Sie mit leerem Array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFragrances = async () => {
      setLoading(true);
      try {
        const data = await fetchFragrances();
        setFragrances(data || []);  // Stellen Sie sicher, dass immer ein Array gesetzt wird
      } catch (err) {
        setError(err.message);
        setFragrances([]);  // Bei Fehler leeres Array setzen
      } finally {
        setLoading(false);
      }
    };
    
    loadFragrances();
  }, []);

  // Filterfunktion für die Suche
  const filteredFragrances = fragrances ? fragrances.filter(fragrance => 
    (fragrance.name && fragrance.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Düfte
      </Typography>
      
      {/* Suchfeld */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Suche nach Duftname"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>
      
      {/* Duftliste */}
      {loading ? (
        <Typography>Lade Düfte...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Beschreibung</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFragrances.map((fragrance) => (
                <TableRow key={fragrance.fragrance_id}>
                  <TableCell>{fragrance.fragrance_id}</TableCell>
                  <TableCell>{fragrance.name}</TableCell>
                  <TableCell>{fragrance.code}</TableCell>
                  <TableCell>{fragrance.description}</TableCell>
                </TableRow>
              ))}
              {filteredFragrances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">Keine Düfte gefunden</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default FragranceListPage;
