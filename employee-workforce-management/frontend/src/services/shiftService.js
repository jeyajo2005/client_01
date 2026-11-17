import { api } from './api';

export const shiftService = {
  async getShifts(companyId = 1) {
    return api.getShifts(companyId);
  },

  async getShiftRequests(companyId = 1) {
    return api.getShiftRequests(companyId);
  },

  async requestShiftChange(payload) {
    return api.requestShiftChange(payload);
  },

  async reviewShiftChange(requestId, approve) {
    return api.reviewShiftChange(requestId, approve);
  }
};

export default shiftService;

