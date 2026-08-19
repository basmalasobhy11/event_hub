const BASE_URL = 'http://localhost:8080';

async function request(baseUrl, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    console.error('API ERROR:', {
      status: res.status,
      path,
      response: data,
      body: options.body,
    });

    const detail =
      typeof data === 'object'
        ? data?.detail || data?.error
        : data;

    throw new Error(
      `${options.method || 'GET'} ${path} failed: ${res.status}${
        detail ? ` - ${JSON.stringify(detail)}` : ''
      }`
    );
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request(BASE_URL, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email, password) =>
    request(BASE_URL, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  catalog: () =>
    request(BASE_URL, '/api/catalog'),

  book: (userId, eventId) =>
    request(BASE_URL, '/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ userId, eventId }),
    }),

  analyze: (text) =>
    request(BASE_URL, '/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  review: (bookingId, text) =>
    request(BASE_URL, `/api/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  analyticsSummary: () =>
    request(BASE_URL, '/api/analytics/summary'),
};
