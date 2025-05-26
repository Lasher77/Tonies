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
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, fetchCustomer, updateCustomer } from '../api';

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street: '',
    postal_code: '',
    city: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const data = await fetchCustomer(id);
        setFormData(data);
        setError('');
      } catch (err) {
        console.error('Fehler beim Laden des Kunden:', err);
        setError('Kunde konnte nicht geladen werden. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung
    if (!formData.first_name || !formData.last_name) {
      setError('Vor- und Nachname sind erforderlich');
      return;
    }
    
    try {
      setSubmitting(true);
      let response;
      
      if (isEditMode) {
        response = await updateCustomer(id, formData);
      } else {
        response = await createCustomer(formData);
      }
      
      setSuccess(true);
      setError('');
      
      // Nach kurzer Verzögerung zur Kundendetailseite navigieren
      setTimeout(() => {
        if (isEditMode) {
          navigate(`/customers/${id}`);
        } else {
          navigate(`/customers/${response.customer_id}`);
        }
      }, 1500);
    } catch (err) {
      console.error('Fehler beim Speichern des Kunden:', err);
      setError('Kunde konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.');
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

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {isEditMode ? 'Kunde bearbeiten' : 'Neuer Kunde'}
        </Typography>
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
                required
                fullWidth
                label="Vorname"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nachname"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="E-Mail"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefon"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Straße und Hausnummer"
                name="street"
                value={formData.street || ''}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Postleitzahl"
                name="postal_code"
                value={formData.postal_code || ''}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Stadt"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                disabled={submitting}
              />
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
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isEditMode ? 'Speichern' : 'Kunde anlegen'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {isEditMode ? 'Kunde erfolgreich aktualisiert' : 'Kunde erfolgreich angelegt'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerFormPage;
