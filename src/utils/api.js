// Vercel serverless funksiyalarini chaqirish uchun helper funksiyalar

const API_BASE = '/api';

/**
 * Generic API request function
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Test hello function
 */
export async function testHelloFunction() {
  return apiRequest('/hello');
}

/**
 * Send POST request to hello function
 */
export async function sendDataToHello(data) {
  return apiRequest('/hello', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get data from Supabase API function
 */
export async function getData() {
  return apiRequest('/supabase', {
    method: 'GET',
  });
}

/**
 * Create new record via Supabase API function
 */
export async function createRecord(data) {
  return apiRequest('/supabase', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update record via Supabase API function
 */
export async function updateRecord(id, data) {
  return apiRequest('/supabase', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

/**
 * Delete record via Supabase API function
 */
export async function deleteRecord(id) {
  return apiRequest(`/supabase?id=${id}`, {
    method: 'DELETE',
  });
}
