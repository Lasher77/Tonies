import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" color="secondary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            Frau Tonies Berlin
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/customers"
              sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
            >
              Kunden
            </Button>
            <Button
              component={RouterLink}
              to="/fragrances"
              sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
            >
              Düfte
            </Button>
          </Box>
          
          <Box
            sx={{
              flexGrow: 0,
              display: 'flex',
              gap: 1,
              alignItems: 'center'
            }}
          >
            <Button
              component={RouterLink}
              to="/customers/new"
              variant="outlined"
              color="primary"
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              Neuer Kunde
            </Button>
            <Button
              component={RouterLink}
              to="/customers/invalid"
              variant="outlined"
              color="primary"
              sx={{ display: { xs: 'none', md: 'inline-flex' }, whiteSpace: 'nowrap' }}
            >
              Unvollständige Düfte
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
