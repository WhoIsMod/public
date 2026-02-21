import api from './api';

export const hospitalAPI = {
  getNavigation: (params) => api.get('/hospital/', { params }),
};
