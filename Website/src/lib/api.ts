const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export { API_BASE_URL };
export const apiFetch = (endpoint: string, options?: RequestInit) =>
  fetch(`${API_BASE_URL}${endpoint}`, options);
