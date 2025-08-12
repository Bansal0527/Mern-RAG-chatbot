
const apiBase = import.meta.env.VITE_API_URL;
export const BASE_URL = apiBase ? `${apiBase}/api/v1` : 'http://localhost:3000/api/v1';

console.log('API BASE URL:', BASE_URL)
export const endpoints = {
  register: `${BASE_URL}/auth/register`,
  login: `${BASE_URL}/auth/login`,
  profile: `${BASE_URL}/auth/profile`,
  uploadDocument: `${BASE_URL}/document/upload`,
  getDocuments: `${BASE_URL}/document`,
  getDocument: (id) => `${BASE_URL}/document/${id}`,
  deleteDocument: (id) => `${BASE_URL}/document/${id}`,
  searchDocuments: (q) => `${BASE_URL}/search?q=${encodeURIComponent(q)}`,
  // Chat endpoints
  createChatSession: `${BASE_URL}/chat/sessions`,
  sendChatMessage: (sessionId) => `${BASE_URL}/chat/sessions/${sessionId}/messages`,
  getChatSessions: `${BASE_URL}/chat/sessions`,
  getChatHistory: (sessionId) => `${BASE_URL}/chat/sessions/${sessionId}`,
  deleteChatSession: (sessionId) => `${BASE_URL}/chat/sessions/${sessionId}`,
};

// Helper for authenticated requests
export async function apiFetch(url, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const opts = { ...options, headers };
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// File upload helper
export async function uploadFile(url, file, token) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
