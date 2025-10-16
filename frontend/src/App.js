import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CustomerSearchPage from './pages/CustomerSearchPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';
import InvalidCompositionCustomersPage from './pages/InvalidCompositionCustomersPage';
import FragranceListPage from './pages/FragranceListPage';
import FragranceFormPage from './pages/FragranceFormPage';
import CompositionFormPage from './pages/CompositionFormPage';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customers" element={<CustomerSearchPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/invalid" element={<InvalidCompositionCustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="/customers/:id/compositions/new" element={<CompositionFormPage />} />
	  <Route path="/compositions/new" element={<CompositionFormPage />} />
          <Route path="/fragrances" element={<FragranceListPage />} />
          <Route path="/fragrances/new" element={<FragranceFormPage />} />
          <Route path="/fragrances/:id/edit" element={<FragranceFormPage />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
