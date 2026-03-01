export const API_URL = "https://proyecto-museocalico2.onrender.com";

//endpoints de auth
export const AUTH_ENDPOINTS = {
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
};

// endpoints de reservas
export const RESERVAS_ENDPOINTS = {
  base: `${API_URL}/api/reservas`,
  byId: (id) => `${API_URL}/api/reservas/${id}`,
};

// endpoint info museo
export const MUSEO_ENDPOINTS = {
  info: `${API_URL}/api/museo/info`,
};