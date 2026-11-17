import { api, calculateDistanceMeters } from './api';

export const attendanceService = {
  async getTodayStatus(employeeId) {
    return api.getTodayAttendance(employeeId);
  },

  async checkIn(payload) {
    return api.checkIn(payload);
  },

  async checkOut(payload) {
    return api.checkOut(payload);
  },

  async startBreak(employeeId, breakType = 'TEA') {
    return api.startBreak(employeeId, breakType);
  },

  async endBreak(employeeId) {
    return api.endBreak(employeeId);
  },

  async getEmployeeHistory(employeeId) {
    return api.getEmployeeAttendance(employeeId);
  },

  async getCompanyHistory(companyId = 1) {
    return api.getCompanyAttendance(companyId);
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    return calculateDistanceMeters(lat1, lon1, lat2, lon2);
  },

  verifyWithinRadius(userLat, userLng, officeLat, officeLng, allowedRadiusMeters = 250) {
    const distance = calculateDistanceMeters(userLat, userLng, officeLat, officeLng);
    return {
      distanceMeters: distance,
      isWithinRadius: distance <= allowedRadiusMeters,
      allowedRadiusMeters
    };
  }
};

export default attendanceService;

