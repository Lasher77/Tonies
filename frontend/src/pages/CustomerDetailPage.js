import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Grid, Card, CardContent,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchCustomers, fetchCompositions } from '../api';

// Hilfsfunktion für dynamische API-URL
const getApiBaseUrl = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '192.168.1.108'
    ? 'http://192.168.1.108:5001/api'
    : `${window.location.protocol}//${window.location.hostname}:5001/api`;
};

function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [compositions, setCompositions] = useState([]);
  const [compositionDetails, setCompositionDetails] = useState({});
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Lade Kundendaten
        const customersData = await fetchCustomers();
        const selectedCustomer = customersData.find(c => c.customer_id === parseInt(id));
        
        if (!selectedCustomer) {
          throw new Error('Kunde nicht gefunden');
        }
        
        setCustomer(selectedCustomer);
        
        // Lade Zusammenstellungen
        const compositionsData = await fetchCompositions();
        // Filtere nur die Zusammenstellungen des ausgewählten Kunden
        const customerCompositions = compositionsData.filter(
          comp => comp.customer_id === parseInt(id)
        );
        
        setCompositions(customerCompositions || []);

        // Lade Düfte für die Referenz
        try {
          const apiBaseUrl = getApiBaseUrl();
          const response = await fetch(`${apiBaseUrl}/fragrances`);
          if (response.ok) {
            const fragrancesData = await response.json();
            setFragrances(fragrancesData || []);
          }
        } catch (err) {
          console.error('Fehler beim Laden der Düfte:', err);
        }

        // Lade Details für jede Zusammenstellung
        const details = {};
        for (const composition of customerCompositions) {
          try {
            const apiBaseUrl = getApiBaseUrl();
            const detailsResponse = await fetch(`${apiBaseUrl}/compositions/${composition.composition_id}/details`);
            if (detailsResponse.ok) {
              const detailsData = await detailsResponse.json();
              details[composition.composition_id] = detailsData || [];
            } else {
              console.error(`Fehler beim Laden der Details für Zusammenstellung ${composition.composition_id}`);
              details[composition.composition_id] = [];
            }
          } catch (err) {
            console.error(`Fehler beim Laden der Details für Zusammenstellung ${composition.composition_id}:`, err);
            details[composition.composition_id] = [];
          }
        }
        setCompositionDetails(details);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadData();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/customers');
  };

  const handleCreateComposition = () => {
    navigate(`/compositions/new?customerId=${id}`);
  };

  // Hilfsfunktion, um den Duftnamen anhand der ID zu finden
  const getFragranceName = (fragranceId) => {
    const fragrance = fragrances.find(f => f.fragrance_id === fragranceId);
    return fragrance ? fragrance.name : 'Unbekannter Duft';
  };

  if (loading) return <Typography>Lade Daten...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!customer) return <Typography>Kunde nicht gefunden</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Zurück zur Kundenliste
      </Button>
      
      <Typography variant="h5" component="h2" gutterBottom>
        Kundendetails
      </Typography>
      
      {/* Kundendetails */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Name:</Typography>
              <Typography variant="body1">{customer.first_name} {customer.last_name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Kontakt:</Typography>
              <Typography variant="body1">
                {customer.email && `E-Mail: ${customer.email}`}<br />
                {customer.phone && `Telefon: ${customer.phone}`}
              </Typography>
            </Grid>
            {customer.street && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">Adresse:</Typography>
                <Typography variant="body1">
                  {customer.street}<br />
                  {customer.postal_code} {customer.city}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Zusammenstellungen</Typography>
        <Button variant="contained" onClick={handleCreateComposition}>
          Neue Zusammenstellung
        </Button>
      </Box>
      
      {/* Zusammenstellungen mit Details */}
      {compositions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Keine Zusammenstellungen gefunden</Typography>
        </Paper>
      ) : (
        <Box>
          {compositions.map((composition) => (
            <Accordion key={composition.composition_id} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${composition.composition_id}-content`}
                id={`panel-${composition.composition_id}-header`}
              >
                <Grid container>
                  <Grid item xs={3}>
                    <Typography fontWeight="bold">
                      {composition.name || `Zusammenstellung #${composition.composition_id}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{composition.total_amount} ml</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {new Date(composition.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {compositionDetails[composition.composition_id] && 
                 compositionDetails[composition.composition_id].length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Duft</TableCell>
                          <TableCell align="right">Menge (ml)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {compositionDetails[composition.composition_id].map((detail) => (
                          <TableRow key={detail.detail_id}>
                            <TableCell>{getFragranceName(detail.fragrance_id)}</TableCell>
                            <TableCell align="right">{detail.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography>Keine Details verfügbar</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CustomerDetailPage;
