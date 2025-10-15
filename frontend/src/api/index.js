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

export const fetchCustomersWithInvalidCompositions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/invalid-compositions`);

    if (!response.ok) {
      let message = 'Fehler beim Laden der Kunden mit ungültigen Zusammenstellungen';
      const payload = await response.text();
      if (payload) {
        try {
          const errorBody = JSON.parse(payload);
          if (errorBody && errorBody.error) {
            message = errorBody.error;
          }
        } catch (parseError) {
          message = payload;
        }
      }
      throw new Error(message);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.customers)) {
      return data.customers;
    }
    return [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unbekannter Fehler beim Laden der Kunden mit ungültigen Zusammenstellungen');
  }
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

// Kunde löschen
export const deleteCustomer = async (id) => {
  const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Fehler beim Löschen des Kunden');
  return res.json();
};

export const deleteComposition = async (id) => {
  const res = await fetch(`${API_BASE_URL}/compositions/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Fehler beim Löschen der Zusammenstellung');
  return res.json();
};
