import { api } from './api';

export const authService = {
  async login(username, password) {
    return api.login(username, password);
  },

  async forgotPassword(email) {
    return api.forgotPassword(email);
  },

  async getProfile() {
    return api.getProfile();
  },

  logout() {
    localStorage.removeItem('workforce_token');
    localStorage.removeItem('workforce_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('workforce_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('workforce_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;

