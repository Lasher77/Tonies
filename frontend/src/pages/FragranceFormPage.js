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
import { fetchFragrances, createFragrance } from '../api';

const FragranceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFragrance = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        // Hole alle Düfte und filtere nach der ID
        const fragrances = await fetchFragrances();
        const fragrance = fragrances.find(f => f.fragrance_id === parseInt(id));
        
        if (fragrance) {
          setFormData(fragrance);
          setError('');
        } else {
          setError(`Grundduft mit ID ${id} nicht gefunden.`);
        }
      } catch (err) {
        console.error('Fehler beim Laden des Grunddufts:', err);
        setError('Grundduft konnte nicht geladen werden. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchFragrance();
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
    if (!formData.name || !formData.code) {
      setError('Name und Code sind erforderlich');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        // Da es keine direkte updateFragrance-Funktion gibt, 
        // müssten wir hier eine eigene Implementierung hinzufügen
        // Für jetzt zeigen wir eine Fehlermeldung an
        setError('Die Bearbeitung von Düften ist in dieser Version nicht implementiert.');
        return;
      } else {
        await createFragrance(formData);
      }
      
      setSuccess(true);
      setError('');
      
      // Nach kurzer Verzögerung zur Duftliste navigieren
      setTimeout(() => {
        navigate('/fragrances');
      }, 1500);
    } catch (err) {
      console.error('Fehler beim Speichern des Grunddufts:', err);
      setError('Grundduft konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.');
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
          {isEditMode ? 'Grundduft bearbeiten' : 'Neuer Grundduft'}
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
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Code"
                name="code"
                type="number"
                value={formData.code}
                onChange={handleChange}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beschreibung"
                name="description"
                multiline
                rows={4}
                value={formData.description || ''}
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
                  isEditMode ? 'Speichern' : 'Duft anlegen'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {isEditMode ? 'Grundduft erfolgreich aktualisiert' : 'Grundduft erfolgreich angelegt'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FragranceFormPage;
