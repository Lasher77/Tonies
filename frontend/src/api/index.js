const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api'
  : `${window.location.protocol}//${window.location.hostname}:5001/api`;

export const fetchCustomers = async ()  => {
  const response = await fetch(`${API_BASE_URL}/customers`);
  if (!response.ok) throw new Error('Fehler beim Laden der Kunden');
  return response.json();
};

export const fetchFragrances = async () => {
  const response = await fetch(`${API_BASE_URL}/fragrances`);
  if (!response.ok) throw new Error('Fehler beim Laden der Düfte');
  return response.json();
};

export const fetchCompositions = async () => {
  const response = await fetch(`${API_BASE_URL}/compositions`);
  if (!response.ok) throw new Error('Fehler beim Laden der Zusammenstellungen');
  return response.json();
};

export const createCustomer = async (customerData) => {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData)
  });
  if (!response.ok) throw new Error('Fehler beim Erstellen des Kunden');
  return response.json();
};

export const createFragrance = async (fragranceData) => {
  const response = await fetch(`${API_BASE_URL}/fragrances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fragranceData)
  });
  if (!response.ok) throw new Error('Fehler beim Erstellen des Duftes');
  return response.json();
};

export const createComposition = async (compositionData) => {
  const response = await fetch(`${API_BASE_URL}/compositions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(compositionData)
  });
  if (!response.ok) throw new Error('Fehler beim Erstellen der Zusammenstellung');
  return response.json();
};

// Lade einen einzelnen Kunden anhand der ID
export const fetchCustomer = async (id) => {
  const res = await fetch(`${API_BASE_URL}/customers/${id}`);
  if (!res.ok) throw new Error('Fehler beim Laden des Kunden');
  return res.json();
};

// Aktualisiere Kundendaten
export const updateCustomer = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Fehler beim Aktualisieren des Kunden');
  return res.json();
};
