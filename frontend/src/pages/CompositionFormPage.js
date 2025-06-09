import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchCustomers, fetchFragrances, createComposition } from '../api';

// Hilfsfunktion zum Extrahieren von Query-Parametern
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CompositionFormPage = () => {
  const { id } = useParams(); // Path-Parameter aus der URL
  const query = useQuery(); // Query-Parameter aus der URL
  const customerId = id || query.get('customerId'); // Verwende entweder Path- oder Query-Parameter
  
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    total_amount: 50,
    details: [],
    created_at: new Date().toISOString().split('T')[0]
  });
  
  const [newDetail, setNewDetail] = useState({
    fragrance_id: '',
    amount: 10
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!customerId) {
          setError('Keine Kunden-ID gefunden. Bitte wählen Sie zuerst einen Kunden aus.');
          setLoading(false);
          return;
        }
        
        // Kundendaten abrufen
        const customerData = await fetchCustomers();
        const customerFound = customerData.find(c => c.customer_id === parseInt(customerId));
        if (customerFound) {
          setCustomer(customerFound);
        } else {
          setError(`Kunde mit ID ${customerId} nicht gefunden.`);
        }
        
        // Grunddüfte abrufen
        const fragrancesData = await fetchFragrances();
        setFragrances(fragrancesData);
        
        setError('');
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err);
        setError('Daten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewDetailChange = (e) => {
    const { name, value } = e.target;
    setNewDetail(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDetail = () => {
    if (!newDetail.fragrance_id) {
      setError('Bitte wählen Sie einen Duft aus');
      return;
    }

    const selectedFragrance = fragrances.find(f => f.fragrance_id === parseInt(newDetail.fragrance_id));
    
    if (!selectedFragrance) {
      setError('Ausgewählter Duft nicht gefunden');
      return;
    }
    
    // Prüfen, ob der Duft bereits hinzugefügt wurde
    const existingDetailIndex = formData.details.findIndex(
      detail => detail.fragrance_id === parseInt(newDetail.fragrance_id)
    );

    if (existingDetailIndex >= 0) {
      // Duft bereits vorhanden, Menge aktualisieren
      const updatedDetails = [...formData.details];
      updatedDetails[existingDetailIndex].amount += Number(newDetail.amount);
      
      setFormData(prev => ({
        ...prev,
        details: updatedDetails
      }));
    } else {
      // Neuen Duft hinzufügen
      const newDetailWithName = {
        ...newDetail,
        fragrance_id: parseInt(newDetail.fragrance_id),
        amount: Number(newDetail.amount),
        fragrance_name: selectedFragrance.name
      };
      
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, newDetailWithName]
      }));
    }

    // Formular zurücksetzen
    setNewDetail({
      fragrance_id: '',
      amount: 10
    });
  };

  const removeDetail = (index) => {
    const updatedDetails = formData.details.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  const calculateTotalAmount = () => {
    return formData.details.reduce((sum, detail) => sum + Number(detail.amount), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung
    if (formData.details.length === 0) {
      setError('Bitte fügen Sie mindestens einen Duft hinzu');
      return;
    }
    
    // Gesamtmenge aktualisieren
    const totalAmount = calculateTotalAmount();
    // Gesamtmenge darf nur 50 ml oder 100 ml betragen
    if (totalAmount !== 50 && totalAmount !== 100) {
      setError('Gesamtmenge muss 50 ml oder 100 ml betragen.');
      setSuccess(false);
      return;
    }

    const compositionData = {
      ...formData,
      total_amount: totalAmount,
      customer_id: parseInt(customerId)
    };
    
    try {
      setSubmitting(true);
      await createComposition(compositionData);
      
      setSuccess(true);
      setError('');
      
      // Nach kurzer Verzögerung zur Kundendetailseite navigieren
      setTimeout(() => {
        navigate(`/customers/${customerId}`);
      }, 1500);
    } catch (err) {
      console.error('Fehler beim Speichern der Duftkreation:', err);
      setError('Duftkreation konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!customerId) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ my: 2 }}>Keine Kunden-ID gefunden. Bitte wählen Sie zuerst einen Kunden aus.</Alert>
        <Button variant="contained" onClick={() => navigate('/customers')}>
          Zur Kundenübersicht
        </Button>
      </Container>
    );
  }

  if (error && !customer) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/customers')}>
          Zurück zur Kundenübersicht
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Neue Duftkreation
        </Typography>
        {customer && (
          <Typography variant="h5" component="h2" color="text.secondary">
            Für {customer.first_name} {customer.last_name}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name der Kreation (optional)"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
                placeholder="z.B. Sommerfrische oder Waldspaziergang"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Datum"
                type="date"
                name="created_at"
                value={formData.created_at}
                onChange={handleChange}
                disabled={submitting}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Düfte hinzufügen
              </Typography>
              
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required={formData.details.length === 0}>
                    <InputLabel id="fragrance-select-label">Duft</InputLabel>
                    <Select
                      labelId="fragrance-select-label"
                      name="fragrance_id"
                      value={newDetail.fragrance_id}
                      onChange={handleNewDetailChange}
                      disabled={submitting}
                    >
                      <MenuItem value="">
                        <em>Bitte wählen</em>
                      </MenuItem>
                      {fragrances.map((fragrance) => (
                        <MenuItem key={fragrance.fragrance_id} value={fragrance.fragrance_id}>
                          {fragrance.name} ({fragrance.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Menge (ml)"
                    name="amount"
                    type="number"
                    value={newDetail.amount}
                    onChange={handleNewDetailChange}
                    disabled={submitting}
                    InputProps={{ inputProps: { min: 1, max: 100 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={addDetail}
                    disabled={submitting || !newDetail.fragrance_id}
                    startIcon={<AddIcon />}
                  >
                    Hinzu
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Zusammenstellung:
              </Typography>
              
              {formData.details.length === 0 ? (
                <Typography color="text.secondary" sx={{ my: 2 }}>
                  Noch keine Düfte hinzugefügt
                </Typography>
              ) : (
                <List>
                  {formData.details.map((detail, index) => (
                    <ListItem key={index} divider={index < formData.details.length - 1}>
                      <ListItemText 
                        primary={detail.fragrance_name} 
                        secondary={`${detail.amount} ml`} 
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => removeDetail(index)} disabled={submitting}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  <ListItem>
                    <ListItemText 
                      primary="Gesamtmenge" 
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                      secondary={`${calculateTotalAmount()} ml`} 
                    />
                  </ListItem>
                </List>
              )}
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ mr: 2 }}
                disabled={submitting}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || formData.details.length === 0}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Kreation speichern'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Duftkreation erfolgreich gespeichert
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CompositionFormPage;
