import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'secondary.main',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Parfümerie | Individuelle Duftkreationen'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link color="inherit" href="#" sx={{ mx: 1 }}>
            Impressum
          </Link>
          <Link color="inherit" href="#" sx={{ mx: 1 }}>
            Datenschutz
          </Link>
          <Link color="inherit" href="#" sx={{ mx: 1 }}>
            Kontakt
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
