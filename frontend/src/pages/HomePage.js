import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Individuelle Duftkreationen
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" paragraph>
          Erstellen Sie einzigartige Parfums für Ihre Kunden
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'secondary.light'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Kunden
            </Typography>
            <Typography variant="body1" paragraph sx={{ flexGrow: 1 }}>
              Verwalten Sie Ihre Kundendaten und sehen Sie deren individuelle Duftkreationen ein.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/customers" 
              variant="contained" 
              color="primary"
              sx={{ alignSelf: 'flex-start' }}
            >
              Zu den Kunden
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'secondary.light'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Düfte
            </Typography>
            <Typography variant="body1" paragraph sx={{ flexGrow: 1 }}>
              Verwalten Sie Ihre Grunddüfte, die als Bausteine für individuelle Kreationen dienen.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/fragrances" 
              variant="contained" 
              color="primary"
              sx={{ alignSelf: 'flex-start' }}
            >
              Zu den Düften
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'secondary.light'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Neuer Kunde
            </Typography>
            <Typography variant="body1" paragraph sx={{ flexGrow: 1 }}>
              Erstellen Sie einen neuen Kunden und beginnen Sie mit der Erstellung individueller Duftkreationen.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/customers/new" 
              variant="contained" 
              color="primary"
              sx={{ alignSelf: 'flex-start' }}
            >
              Kunden anlegen
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
