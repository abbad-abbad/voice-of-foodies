// ============================================================
// api.js – All communication with the backend REST API
// (replaces the old localStorage-based storage.js)
// ============================================================

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'vof_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error('Could not reach the server. Please make sure the API is running.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
}

// ---- AUTH ----

export async function registerUser({ name, email, password }) {
  try {
    const data = await request('/auth/signup', { method: 'POST', body: { name, email, password } });
    setToken(data.token);
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function loginUser({ email, password }) {
  try {
    const data = await request('/auth/login', { method: 'POST', body: { email, password } });
    setToken(data.token);
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function fetchCurrentUser() {
  try {
    const data = await request('/auth/me', { auth: true });
    return data.user;
  } catch {
    return null;
  }
}

export function logoutUser() {
  clearToken();
}

// ---- PROFILE (CRUD) ----

export async function updateProfile(updates) {
  try {
    const data = await request('/users/me', { method: 'PUT', body: updates, auth: true });
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteAccount() {
  try {
    await request('/users/me', { method: 'DELETE', auth: true });
    clearToken();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ---- REVIEWS ----

export async function getReviews() {
  try {
    const data = await request('/reviews');
    return data.reviews;
  } catch {
    return [];
  }
}

export async function addReview({ restaurantName, category, rating, reviewText }) {
  const data = await request('/reviews', {
    method: 'POST',
    auth: true,
    body: { restaurantName, category, rating, reviewText },
  });
  return data.review;
}

export async function updateReview(id, updates) {
  const data = await request(`/reviews/${id}`, { method: 'PUT', auth: true, body: updates });
  return data.review;
}

export async function deleteReview(id) {
  await request(`/reviews/${id}`, { method: 'DELETE', auth: true });
}
