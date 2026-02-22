import axios from 'axios';

const API_BASE = '/api';
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  staffLogin: (data) => api.post('/auth/staff-login/', data),
  getProfile: () => api.get('/patients/profile/'),
  updateProfile: (data) => api.patch('/patients/profile/', data),
  getPatients: () => api.get('/patients/list/'),
};

export const medicalAPI = {
  createRecord: (data) => api.post('/medical/create/', data),
  getRecords: () => api.get('/medical/list/'),
  getRecord: (id) => api.get(`/medical/${id}/`),
  updateRecord: (id, data) => api.patch(`/medical/${id}/`, data),
  deleteRecord: (id) => api.delete(`/medical/${id}/`),
};

export const appointmentAPI = {
  create: (data) => api.post('/appointments/create/', data),
  getList: () => api.get('/appointments/list/'),
  getDetail: (id) => api.get(`/appointments/${id}/`),
  cancel: (id) => api.post(`/appointments/${id}/cancel/`),
};

export const staffAPI = {
  getList: (params) => api.get('/staff/list/', { params }),
  getDetail: (id) => api.get(`/staff/${id}/`),
};

export const pharmacyAPI = {
  getMedications: () => api.get('/pharmacy/medications/'),
  getMedication: (id) => api.get(`/pharmacy/medications/${id}/`),
  getPrescriptions: () => api.get('/pharmacy/prescriptions/'),
  createOrder: (data) => api.post('/pharmacy/orders/create/', data),
  getOrders: () => api.get('/pharmacy/orders/'),
};

export const paymentAPI = {
  getBills: () => api.get('/payments/bills/'),
  getBill: (id) => api.get(`/payments/bills/${id}/`),
  processPayment: (billId, data) => api.post(`/payments/process/${billId}/`, data),
  getPayments: () => api.get('/payments/list/'),
};

export const documentAPI = {
  upload: (formData) =>
    api.post('/documents/upload/', formData, {
      headers: { 'Content-Type': undefined },
    }),
  getList: () => api.get('/documents/list/'),
  getDetail: (id) => api.get(`/documents/${id}/`),
  download: (id) => api.get(`/documents/${id}/download/`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/documents/${id}/`),
};

export const aiAPI = {
  interpret: (documentId) => api.post(`/ai/interpret/${documentId}/`),
  getInterpretations: () => api.get('/ai/interpretations/'),
  getInterpretation: (id) => api.get(`/ai/interpretations/${id}/`),
};

export default api;
